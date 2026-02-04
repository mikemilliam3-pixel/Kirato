import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';
import axios from 'axios';
import { GoogleGenAI } from "@google/genai";

// Standard ESM equivalent for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 1. Basic Middlewares
app.use(express.json());

// 2. Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: 'kirato-ai'
  });
}

const db = admin.firestore();

// --- AI LOGIC ---

/**
 * Generate AI Caption
 */
app.post('/api/ai/caption', async (req, res) => {
  const { topic, tone, language } = req.body;
  if (!topic) return res.status(400).json({ error: "Topic is required" });

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a short, engaging social media post caption for the topic: "${topic}". Tone: ${tone || 'casual'}. Language: ${language || 'EN'}. Include relevant emojis and a few hashtags.`,
    });

    res.json({ caption: response.text });
  } catch (error) {
    console.error("AI Caption Error:", error);
    res.status(500).json({ error: "Failed to generate caption" });
  }
});

// --- SMM & CONTENT PLANNER LOGIC ---

// MOCK SECRETS (In production use process.env or Secret Manager)
const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN || "7239841221:AAGmock_token_for_smm";
const META_APP_ID = process.env.META_APP_ID || "mock_meta_id";
const META_APP_SECRET = process.env.META_APP_SECRET || "mock_meta_secret";
const META_REDIRECT_URI = process.env.META_REDIRECT_URI || "http://localhost:8080/api/meta/auth/callback";

/**
 * Verify Telegram Bot access to channel
 */
app.post('/api/smm/telegram/verify', async (req, res) => {
  const { uid, channelIdOrUsername } = req.body;
  if (!uid || !channelIdOrUsername) return res.status(400).send("Missing data");

  try {
    // Call GetChat to verify bot is in channel
    const tgRes = await axios.get(`https://api.telegram.org/bot${TG_BOT_TOKEN}/getChat?chat_id=${channelIdOrUsername}`);
    if (tgRes.data.ok) {
      res.json({ ok: true, chat: tgRes.data.result });
    } else {
      res.status(400).json({ error: "Bot not found in channel" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Start Meta (FB/IG) OAuth flow
 */
app.get('/api/meta/auth/start', async (req, res) => {
  const { uid } = req.query;
  if (!uid) return res.status(401).send("No UID provided");
  
  const scope = "pages_show_list,instagram_basic,instagram_content_publish,pages_read_engagement,pages_manage_posts,public_profile";
  const url = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${META_APP_ID}&redirect_uri=${META_REDIRECT_URI}&state=${uid}&scope=${scope}`;
  
  res.redirect(url);
});

/**
 * Meta OAuth Callback
 */
app.get('/api/meta/auth/callback', async (req, res) => {
  const { code, state: uid } = req.query;
  if (!code || !uid) return res.status(400).send("Invalid callback params");

  try {
    // 1. Exchange code for access token
    const tokenRes = await axios.get(`https://graph.facebook.com/v19.0/oauth/access_token?client_id=${META_APP_ID}&redirect_uri=${META_REDIRECT_URI}&client_secret=${META_APP_SECRET}&code=${code}`);
    const userAccessToken = tokenRes.data.access_token;

    // 2. Fetch User Pages
    const pagesRes = await axios.get(`https://graph.facebook.com/v19.0/me/accounts?access_token=${userAccessToken}`);
    const pages = pagesRes.data.data;
    
    if (pages.length === 0) throw new Error("No Facebook Pages found");

    const primaryPage = pages[0]; // Simplification: pick first page
    
    // 3. Find connected Instagram Account
    const igRes = await axios.get(`https://graph.facebook.com/v19.0/${primaryPage.id}?fields=instagram_business_account&access_token=${primaryPage.access_token}`);
    const igAccountId = igRes.data.instagram_business_account?.id;

    // 4. Update Firestore Integration
    // In production, encrypt tokens before storing!
    await db.collection('smm_integrations').doc(uid.toString()).set({
      ownerId: uid,
      meta: {
        facebookPageId: primaryPage.id,
        instagramBusinessAccountId: igAccountId || null,
        isConnected: true,
        connectedAt: admin.firestore.FieldValue.serverTimestamp(),
        // Internal fields (not returned to client via rules)
        _pageAccessToken: primaryPage.access_token 
      }
    }, { merge: true });

    res.redirect('/#/modules/smm/content-planner?meta_success=true');
  } catch (error) {
    console.error("Meta OAuth Error:", error.message);
    res.redirect('/#/modules/smm/content-planner?meta_error=' + encodeURIComponent(error.message));
  }
});

/**
 * Single Publishing Logic
 */
const publishPost = async (postDoc) => {
  const post = postDoc.data();
  const postId = postDoc.id;
  const postRef = db.collection('smm_posts').doc(postId);

  try {
    await postRef.update({ status: 'publishing', updatedAt: admin.firestore.FieldValue.serverTimestamp() });

    const integrationSnap = await db.collection('smm_integrations').doc(post.ownerId).get();
    if (!integrationSnap.exists) throw new Error("Account not connected");
    const integration = integrationSnap.data();

    let result;

    if (post.platform === 'telegram') {
      const channel = integration.telegram?.channelIdOrUsername;
      if (!channel) throw new Error("Telegram channel not configured");

      const tgRes = await axios.post(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
        chat_id: channel,
        text: post.content,
        parse_mode: 'HTML'
      });
      result = { platformPostId: tgRes.data.result.message_id.toString() };
    } 
    else if (post.platform === 'facebook') {
      const pageId = integration.meta?.facebookPageId;
      const token = integration.meta?._pageAccessToken;
      if (!pageId || !token) throw new Error("Meta Page not connected");

      const fbRes = await axios.post(`https://graph.facebook.com/v19.0/${pageId}/feed?message=${encodeURIComponent(post.content)}&access_token=${token}`);
      result = { platformPostId: fbRes.data.id };
    }
    else if (post.platform === 'instagram') {
      const igId = integration.meta?.instagramBusinessAccountId;
      const token = integration.meta?._pageAccessToken;
      if (!igId || !token) throw new Error("Instagram Business not connected");
      
      // Instagram requires media. For text-only, we mock or return error. 
      // Most production apps generate a canvas image for text-only IG posts.
      throw new Error("Instagram requires an image or video for posting");
    }

    await postRef.update({ 
      status: 'published', 
      publishResult: result,
      updatedAt: admin.firestore.FieldValue.serverTimestamp() 
    });

  } catch (err) {
    console.error(`Publish failed for ${postId}:`, err.message);
    await postRef.update({ 
      status: 'failed', 
      publishResult: { error: err.message },
      updatedAt: admin.firestore.FieldValue.serverTimestamp() 
    });
  }
};

/**
 * Scheduler Endpoint (Triggered by Cloud Scheduler)
 */
app.post('/api/smm/publish-due', async (req, res) => {
  const now = admin.firestore.Timestamp.now();
  const q = db.collection('smm_posts')
    .where('status', '==', 'scheduled')
    .where('scheduledAt', '<=', now);

  const snapshot = await q.get();
  const promises = snapshot.docs.map(doc => publishPost(doc));
  
  await Promise.all(promises);
  res.json({ processed: snapshot.size });
});

// --- STANDARD MIDDLEWARE ---
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Kirato AI Backend listening on port ${PORT}`);
});
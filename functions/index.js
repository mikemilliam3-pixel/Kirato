const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

/**
 * Validates that the caller is an admin.
 */
const validateAdmin = async (context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
  }
  const userDoc = await db.collection('users').doc(context.auth.uid).get();
  if (!userDoc.exists || userDoc.data().role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can perform this action.');
  }
};

/**
 * Submits a seller application.
 */
exports.submitSellerApplication = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
  
  const { storeName, category, phone } = data;
  const uid = context.auth.uid;

  const batch = db.batch();

  const appRef = db.collection('sellerApplications').doc(uid);
  batch.set(appRef, {
    userId: uid,
    storeName,
    category,
    phone: phone || null,
    status: 'pending',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  const userRef = db.collection('users').doc(uid);
  batch.update(userRef, {
    sellerStatus: 'pending',
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  await batch.commit();
  return { success: true };
});

/**
 * Approves a seller application.
 */
exports.approveSeller = functions.https.onCall(async (data, context) => {
  await validateAdmin(context);
  
  const { applicationId } = data;
  const appRef = db.collection('sellerApplications').doc(applicationId);
  const appDoc = await appRef.get();

  if (!appDoc.exists) throw new functions.https.HttpsError('not-found', 'Application not found.');

  const sellerUid = appDoc.data().userId;
  const batch = db.batch();

  batch.update(appRef, {
    status: 'approved',
    reviewedBy: context.auth.uid,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  batch.update(db.collection('users').doc(sellerUid), {
    sellerStatus: 'approved',
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  await batch.commit();
  return { success: true };
});

/**
 * Denies a seller application.
 */
exports.denySeller = functions.https.onCall(async (data, context) => {
  await validateAdmin(context);
  
  const { applicationId, reviewNote } = data;
  const appRef = db.collection('sellerApplications').doc(applicationId);
  const appDoc = await appRef.get();

  if (!appDoc.exists) throw new functions.https.HttpsError('not-found', 'Application not found.');

  const sellerUid = appDoc.data().userId;
  const batch = db.batch();

  batch.update(appRef, {
    status: 'denied',
    reviewNote: reviewNote || 'No reason provided',
    reviewedBy: context.auth.uid,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  batch.update(db.collection('users').doc(sellerUid), {
    sellerStatus: 'rejected',
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  await batch.commit();
  return { success: true };
});
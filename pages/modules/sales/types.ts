
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'disputed' | 'refunded';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';
export type ProductStatus = 'active' | 'draft' | 'out_of_stock' | 'pending' | 'archived';
export type PromoType = 'percentage' | 'fixed_amount' | 'free_shipping';
export type ProductVisibility = 'public' | 'private' | 'unlisted';
export type PayoutStatus = 'on_hold' | 'eligible' | 'released' | 'frozen';
export type RiskLevel = 'low' | 'medium' | 'high';
export type Carrier = 'DHL' | 'UPS' | 'Local' | 'Other';
export type DisputeReason = 'not_received' | 'damaged' | 'wrong_item' | 'other';

export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';
export type SellerType = 'individual' | 'business';
export type DocumentType = 'id_front' | 'id_back' | 'business_certificate';

export interface VerificationDocument {
  id: string;
  type: DocumentType;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  previewUrl?: string; // objectURL or base64 for local demo
  storageRef?: string; // placeholder for backend
}

export interface VerificationHistoryItem {
  action: 'submitted' | 'approved' | 'rejected' | 'resubmitted';
  at: string;
  note?: string;
}

export interface ShopWorkingHours {
  days: DayOfWeek[];
  startTime: string; // '09:00'
  endTime: string;   // '20:00'
}

export interface ShopProfile {
  shopName: string;
  logoUrl?: string;
  bannerUrl?: string;
  description?: string;
  city?: string;
  workingHours?: string | ShopWorkingHours;
  telegram?: string;
  phone?: string;
  email?: string;
  
  sellerType?: SellerType;
  verificationStatus?: VerificationStatus;
  verificationNote?: string;
  verificationDocs?: VerificationDocument[];
  verificationSubmittedAt?: string;
  verifiedAt?: string;
  verificationHistory?: VerificationHistoryItem[];
}

export interface SellerProfile extends ShopProfile {
  id: string;
  currency: string;
  isAiChatEnabled: boolean;
  telegramChannelId?: string;
  deepLinkToken: string;
  riskLevel: RiskLevel;
}

export type HandoffMode = 'ai' | 'seller';
export type SellerPresence = 'online' | 'offline';
export type MessageSender = 'buyer' | 'seller' | 'ai';
export type MessageDelivery = 'sending' | 'sent' | 'failed' | 'read';

export interface Conversation {
  id: string;
  sellerId: string;
  buyerId: string;
  buyerDisplayName?: string;
  lastMessageAt: string;
  lastMessageText?: string;
  status: 'open' | 'closed';
  handoffMode: HandoffMode;
  sellerPresence: SellerPresence;
  aiEnabled: boolean;
  unreadCount: number;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: MessageSender;
  text: string;
  createdAt: string;
  delivery: MessageDelivery;
}

export interface DisputeData {
  reason: DisputeReason;
  description: string;
  images?: string[];
  createdAt: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  address?: string;
  // Marketplace & Escrow fields
  payoutStatus: PayoutStatus;
  payoutEligibleAt?: string;
  payoutReleasedAt?: string;
  shippedAt?: string;
  trackingNumber?: string;
  carrier?: Carrier;
  dispute?: DisputeData;
}

export interface Product {
  id: string;
  slug?: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  tags: string[];
  price: number;
  salePrice?: number;
  discount?: number;
  currency: string;
  stock: number;
  status: ProductStatus;
  visibility: ProductVisibility;
  approvalRequired: boolean;
  trialAvailable: boolean;
  trialDays?: number;
  images: string[];
  videoUrl?: string;
  sampleOutputScreenshot?: string;
  createdAt: string;
  deepLink?: string;
}

export interface IntegrationConfig {
  connected: boolean;
  botMode?: 'platform' | 'own';
  botUsername?: string;
  botToken?: string;
  channelUsername?: string;
  accountName?: string;
  accountType?: 'business' | 'creator';
  pageId?: string;
  connectedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  count: number;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
}

export interface CustomerProfile {
  id: string;
  tgId: string;
  fullName: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  isBlocked: boolean;
}

export interface Promotion {
  id: string;
  code: string;
  type: PromoType;
  value: number;
  minSpend?: number;
  expiryDate?: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
}

export interface SalesSection {
  id: string;
  path: string;
  icon: string;
  labelKey: string;
}

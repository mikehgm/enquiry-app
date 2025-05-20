export interface LoyalClient {
  clientId: number;
  name: string;
  email: string;
  phone: string;
  totalEnquiries: number;
  lastInteraction: Date;
  hasPromotionSent: boolean;
}

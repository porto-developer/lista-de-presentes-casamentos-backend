export interface CreatePixPaymentData {
  orderId: number;
  amount: number;
  description: string;
}

export interface CreateCardPaymentData {
  orderId: number;
  amount: number;
  description: string;
  cardLastFour?: string;
  installments?: number;
}

export interface PixPaymentResult {
  providerPaymentId: string;
  qrCode: string;
  copyPasteCode: string;
  expiresAt: Date;
}

export interface CardPaymentResult {
  providerPaymentId: string;
  status: 'processing' | 'approved' | 'rejected';
}

export interface WebhookEvent {
  providerPaymentId: string;
  status: 'approved' | 'rejected' | 'failed';
  rawPayload: Record<string, unknown>;
}

export const PAYMENT_GATEWAY = 'PAYMENT_GATEWAY';

export interface PaymentGateway {
  createPixPayment(data: CreatePixPaymentData): Promise<PixPaymentResult>;
  createCardPayment(data: CreateCardPaymentData): Promise<CardPaymentResult>;
  verifyWebhookSignature(payload: unknown, signature: string): boolean;
  parseWebhookEvent(payload: unknown): WebhookEvent;
}

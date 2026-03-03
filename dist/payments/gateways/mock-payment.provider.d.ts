import { PaymentGateway, CreatePixPaymentData, CreateCardPaymentData, PixPaymentResult, CardPaymentResult, WebhookEvent } from './payment-gateway.interface';
export declare class MockPaymentProvider implements PaymentGateway {
    private readonly logger;
    createPixPayment(data: CreatePixPaymentData): Promise<PixPaymentResult>;
    createCardPayment(data: CreateCardPaymentData): Promise<CardPaymentResult>;
    verifyWebhookSignature(_payload: unknown, _signature: string): boolean;
    parseWebhookEvent(payload: unknown): WebhookEvent;
}

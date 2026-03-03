import { ConfigService } from '@nestjs/config';
import { PaymentGateway } from '../payments/gateways/payment-gateway.interface';
import { PaymentsService } from '../payments/payments.service';
export declare class WebhookService {
    private readonly paymentGateway;
    private readonly paymentsService;
    private readonly configService;
    private readonly logger;
    constructor(paymentGateway: PaymentGateway, paymentsService: PaymentsService, configService: ConfigService);
    handlePaymentWebhook(payload: unknown, signature: string): Promise<{
        received: boolean;
    }>;
}

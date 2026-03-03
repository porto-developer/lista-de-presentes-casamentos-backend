import { WebhookService } from './webhook.service';
export declare class WebhookController {
    private readonly webhookService;
    constructor(webhookService: WebhookService);
    handlePayment(payload: Record<string, unknown>, signature: string): Promise<{
        received: boolean;
    }>;
}

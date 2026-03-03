import { PaymentsService } from './payments.service';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    findByOrderId(orderId: number): Promise<import("./payment.entity").Payment>;
    confirm(orderId: number, dto: ConfirmPaymentDto): Promise<{
        success: boolean;
        payment_id: string;
        payment_method: string;
        card_last_four: string | null;
        installments: number;
    }>;
}

import { DataSource, Repository } from 'typeorm';
import { Payment } from './payment.entity';
export declare class PaymentsService {
    private readonly paymentRepository;
    private readonly dataSource;
    private readonly logger;
    constructor(paymentRepository: Repository<Payment>, dataSource: DataSource);
    findByOrderId(orderId: number): Promise<Payment>;
    confirmPayment(orderId: number, cardLastFour?: string, installments?: number): Promise<{
        success: boolean;
        payment_id: string;
        payment_method: string;
        card_last_four: string | null;
        installments: number;
    }>;
    approveByProviderPaymentId(providerPaymentId: string): Promise<void>;
    rejectByProviderPaymentId(providerPaymentId: string): Promise<void>;
}

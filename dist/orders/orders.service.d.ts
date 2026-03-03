import { DataSource, Repository } from 'typeorm';
import { Order } from './order.entity';
import { GuestsService } from '../guests/guests.service';
import { PaymentGateway } from '../payments/gateways/payment-gateway.interface';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersService {
    private readonly orderRepository;
    private readonly dataSource;
    private readonly guestsService;
    private readonly paymentGateway;
    private readonly logger;
    constructor(orderRepository: Repository<Order>, dataSource: DataSource, guestsService: GuestsService, paymentGateway: PaymentGateway);
    create(dto: CreateOrderDto): Promise<{
        order_id: number;
        total: number;
        payment_method: string;
        pix_code: string | null | undefined;
        pix_qr_code: string | null | undefined;
        expires_at: Date | null | undefined;
        status?: undefined;
    } | {
        order_id: number;
        total: number;
        payment_method: string;
        status: string;
        pix_code?: undefined;
        pix_qr_code?: undefined;
        expires_at?: undefined;
    }>;
    findOne(id: number): Promise<Order | null>;
}

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
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
}

import { Order } from '../orders/order.entity';
export declare class Payment {
    id: number;
    order_id: number;
    provider: string;
    provider_payment_id: string;
    method: string;
    amount: number;
    status: string;
    pix_qr_code: string | null;
    pix_copy_paste: string | null;
    expires_at: Date | null;
    created_at: Date;
    updated_at: Date;
    order: Order;
}

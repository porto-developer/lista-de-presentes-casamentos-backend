import { Order } from './order.entity';
export declare class OrderItem {
    id: number;
    order_id: number;
    gift_id: number;
    gift_name: string;
    gift_price: number;
    created_at: Date;
    order: Order;
}

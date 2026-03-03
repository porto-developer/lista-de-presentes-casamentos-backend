import { OrderItem } from './order-item.entity';
export declare class Order {
    id: number;
    guest_phone: string;
    guest_name: string;
    guest_message: string | null;
    total: number;
    payment_method: string;
    payment_status: string;
    payment_id: string | null;
    created_at: Date;
    items: OrderItem[];
}

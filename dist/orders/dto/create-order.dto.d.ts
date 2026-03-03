export declare class OrderItemDto {
    gift_id: number;
    gift_name: string;
    gift_price: number;
}
export declare enum PaymentMethodEnum {
    PIX = "pix",
    CREDIT_CARD = "credit_card"
}
export declare class CreateOrderDto {
    guest_name: string;
    guest_phone: string;
    guest_message?: string;
    payment_method: PaymentMethodEnum;
    items: OrderItemDto[];
}

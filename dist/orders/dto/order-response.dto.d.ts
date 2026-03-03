export declare class OrderPixResponseDto {
    order_id: number;
    total: number;
    payment_method: string;
    pix_code: string;
    pix_qr_code: string | null;
    expires_at: Date;
}
export declare class OrderCardResponseDto {
    order_id: number;
    total: number;
    payment_method: string;
    status: string;
}

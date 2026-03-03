export declare class PaymentStatusResponseDto {
    id: number;
    order_id: number;
    method: string;
    amount: number;
    status: string;
    pix_qr_code: string | null;
    pix_copy_paste: string | null;
    expires_at: Date | null;
    created_at: Date;
}
export declare class PaymentConfirmResponseDto {
    success: boolean;
    payment_id: string;
    payment_method: string;
    card_last_four: string | null;
    installments: number;
}

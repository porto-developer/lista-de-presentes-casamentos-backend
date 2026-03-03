export declare enum PaymentProvider {
    MOCK = "mock",
    MERCADO_PAGO = "mercado_pago",
    STRIPE = "stripe"
}
export declare class EnvironmentVariables {
    DATABASE_HOST: string;
    DATABASE_PORT: number;
    DATABASE_USER: string;
    DATABASE_PASSWORD: string;
    DATABASE_NAME: string;
    PORT: number;
    PAYMENT_PROVIDER: PaymentProvider;
    WEBHOOK_SECRET: string;
}
export declare function validate(config: Record<string, unknown>): EnvironmentVariables;

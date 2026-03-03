"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentGatewayProvider = void 0;
const config_1 = require("@nestjs/config");
const payment_gateway_interface_1 = require("./payment-gateway.interface");
const mock_payment_provider_1 = require("./mock-payment.provider");
exports.PaymentGatewayProvider = {
    provide: payment_gateway_interface_1.PAYMENT_GATEWAY,
    useFactory: (configService) => {
        const provider = configService.get('PAYMENT_PROVIDER', 'mock');
        switch (provider) {
            case 'mock':
            default:
                return new mock_payment_provider_1.MockPaymentProvider();
        }
    },
    inject: [config_1.ConfigService],
};
//# sourceMappingURL=payment-gateway.factory.js.map
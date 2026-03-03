"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MockPaymentProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockPaymentProvider = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
let MockPaymentProvider = MockPaymentProvider_1 = class MockPaymentProvider {
    constructor() {
        this.logger = new common_1.Logger(MockPaymentProvider_1.name);
    }
    async createPixPayment(data) {
        this.logger.log(`[MOCK] Creating PIX payment for order ${data.orderId}: R$${data.amount}`);
        const paymentId = `mock_pix_${(0, uuid_1.v4)()}`;
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 30);
        return {
            providerPaymentId: paymentId,
            qrCode: `https://mock-qr.example.com/${paymentId}`,
            copyPasteCode: `00020126580014BR.GOV.BCB.PIX0136${paymentId}5204000053039865802BR5913CASAMENTO6009SAOPAULO62140510PED${data.orderId}`,
            expiresAt,
        };
    }
    async createCardPayment(data) {
        this.logger.log(`[MOCK] Creating card payment for order ${data.orderId}: R$${data.amount} (${data.installments || 1}x)`);
        return {
            providerPaymentId: `mock_card_${(0, uuid_1.v4)()}`,
            status: 'processing',
        };
    }
    verifyWebhookSignature(_payload, _signature) {
        this.logger.log('[MOCK] Webhook signature verification — always returns true');
        return true;
    }
    parseWebhookEvent(payload) {
        const body = payload;
        return {
            providerPaymentId: body.provider_payment_id || '',
            status: body.status || 'approved',
            rawPayload: body,
        };
    }
};
exports.MockPaymentProvider = MockPaymentProvider;
exports.MockPaymentProvider = MockPaymentProvider = MockPaymentProvider_1 = __decorate([
    (0, common_1.Injectable)()
], MockPaymentProvider);
//# sourceMappingURL=mock-payment.provider.js.map
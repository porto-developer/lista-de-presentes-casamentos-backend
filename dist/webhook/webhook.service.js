"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var WebhookService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const payment_gateway_interface_1 = require("../payments/gateways/payment-gateway.interface");
const payments_service_1 = require("../payments/payments.service");
let WebhookService = WebhookService_1 = class WebhookService {
    constructor(paymentGateway, paymentsService, configService) {
        this.paymentGateway = paymentGateway;
        this.paymentsService = paymentsService;
        this.configService = configService;
        this.logger = new common_1.Logger(WebhookService_1.name);
    }
    async handlePaymentWebhook(payload, signature) {
        const webhookSecret = this.configService.get('WEBHOOK_SECRET');
        if (webhookSecret && webhookSecret !== 'change-me-in-production') {
            const isValid = this.paymentGateway.verifyWebhookSignature(payload, signature);
            if (!isValid) {
                throw new common_1.BadRequestException('Assinatura do webhook inválida');
            }
        }
        const event = this.paymentGateway.parseWebhookEvent(payload);
        if (!event.providerPaymentId) {
            throw new common_1.BadRequestException('provider_payment_id ausente no payload');
        }
        this.logger.log(`Webhook received: ${event.providerPaymentId} -> ${event.status}`);
        switch (event.status) {
            case 'approved':
                await this.paymentsService.approveByProviderPaymentId(event.providerPaymentId);
                break;
            case 'rejected':
            case 'failed':
                await this.paymentsService.rejectByProviderPaymentId(event.providerPaymentId);
                break;
            default:
                this.logger.warn(`Unhandled webhook status: ${event.status}`);
        }
        return { received: true };
    }
};
exports.WebhookService = WebhookService;
exports.WebhookService = WebhookService = WebhookService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(payment_gateway_interface_1.PAYMENT_GATEWAY)),
    __metadata("design:paramtypes", [Object, payments_service_1.PaymentsService,
        config_1.ConfigService])
], WebhookService);
//# sourceMappingURL=webhook.service.js.map
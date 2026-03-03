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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const payments_service_1 = require("./payments.service");
const confirm_payment_dto_1 = require("./dto/confirm-payment.dto");
const payment_response_dto_1 = require("./dto/payment-response.dto");
let PaymentsController = class PaymentsController {
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    findByOrderId(orderId) {
        return this.paymentsService.findByOrderId(orderId);
    }
    confirm(orderId, dto) {
        return this.paymentsService.confirmPayment(orderId, dto.card_last_four, dto.installments);
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Get)(':orderId'),
    (0, swagger_1.ApiOperation)({ summary: 'Retorna status do pagamento de um pedido' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: payment_response_dto_1.PaymentStatusResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Pagamento não encontrado' }),
    __param(0, (0, common_1.Param)('orderId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "findByOrderId", null);
__decorate([
    (0, common_1.Post)(':orderId/confirm'),
    (0, swagger_1.ApiOperation)({ summary: 'Confirma pagamento manualmente (fallback)' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: payment_response_dto_1.PaymentConfirmResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Pedido não encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Pedido já pago ou presente indisponível' }),
    __param(0, (0, common_1.Param)('orderId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, confirm_payment_dto_1.ConfirmPaymentDto]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "confirm", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, swagger_1.ApiTags)('Payments'),
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map
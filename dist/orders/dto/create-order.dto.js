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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrderDto = exports.PaymentMethodEnum = exports.OrderItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class OrderItemDto {
}
exports.OrderItemDto = OrderItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], OrderItemDto.prototype, "gift_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Jogo de Panelas' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], OrderItemDto.prototype, "gift_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 299.9 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], OrderItemDto.prototype, "gift_price", void 0);
var PaymentMethodEnum;
(function (PaymentMethodEnum) {
    PaymentMethodEnum["PIX"] = "pix";
    PaymentMethodEnum["CREDIT_CARD"] = "credit_card";
})(PaymentMethodEnum || (exports.PaymentMethodEnum = PaymentMethodEnum = {}));
class CreateOrderDto {
}
exports.CreateOrderDto = CreateOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'João da Silva' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nome é obrigatório' }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "guest_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '11999998888' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Telefone é obrigatório' }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "guest_phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Parabéns aos noivos!', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "guest_message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: PaymentMethodEnum, example: 'pix' }),
    (0, class_validator_1.IsEnum)(PaymentMethodEnum, { message: 'Método de pagamento deve ser pix ou credit_card' }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "payment_method", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [OrderItemDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'Pedido deve conter ao menos 1 item' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => OrderItemDto),
    __metadata("design:type", Array)
], CreateOrderDto.prototype, "items", void 0);
//# sourceMappingURL=create-order.dto.js.map
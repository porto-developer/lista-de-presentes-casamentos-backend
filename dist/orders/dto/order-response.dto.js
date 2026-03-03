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
exports.OrderCardResponseDto = exports.OrderPixResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class OrderPixResponseDto {
}
exports.OrderPixResponseDto = OrderPixResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderPixResponseDto.prototype, "order_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderPixResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'pix' }),
    __metadata("design:type", String)
], OrderPixResponseDto.prototype, "payment_method", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderPixResponseDto.prototype, "pix_code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true }),
    __metadata("design:type", Object)
], OrderPixResponseDto.prototype, "pix_qr_code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], OrderPixResponseDto.prototype, "expires_at", void 0);
class OrderCardResponseDto {
}
exports.OrderCardResponseDto = OrderCardResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderCardResponseDto.prototype, "order_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderCardResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'credit_card' }),
    __metadata("design:type", String)
], OrderCardResponseDto.prototype, "payment_method", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'processing' }),
    __metadata("design:type", String)
], OrderCardResponseDto.prototype, "status", void 0);
//# sourceMappingURL=order-response.dto.js.map
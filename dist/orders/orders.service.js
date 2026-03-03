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
var OrdersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./order.entity");
const order_item_entity_1 = require("./order-item.entity");
const gift_entity_1 = require("../gifts/gift.entity");
const guests_service_1 = require("../guests/guests.service");
const payment_entity_1 = require("../payments/payment.entity");
const payment_gateway_interface_1 = require("../payments/gateways/payment-gateway.interface");
const create_order_dto_1 = require("./dto/create-order.dto");
let OrdersService = OrdersService_1 = class OrdersService {
    constructor(orderRepository, dataSource, guestsService, paymentGateway) {
        this.orderRepository = orderRepository;
        this.dataSource = dataSource;
        this.guestsService = guestsService;
        this.paymentGateway = paymentGateway;
        this.logger = new common_1.Logger(OrdersService_1.name);
    }
    async create(dto) {
        const phone = dto.guest_phone.replace(/\D/g, '');
        if (phone.length < 10 || phone.length > 11) {
            throw new common_1.BadRequestException('Telefone inválido');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await this.guestsService.upsert(dto.guest_name, phone, queryRunner);
            const giftIds = dto.items.map((i) => i.gift_id);
            const gifts = await queryRunner.manager.find(gift_entity_1.Gift, {
                where: { id: (0, typeorm_2.In)(giftIds) },
                lock: { mode: 'pessimistic_write' },
            });
            if (gifts.length !== giftIds.length) {
                throw new common_1.BadRequestException('Um ou mais presentes não foram encontrados');
            }
            const unavailable = gifts.filter((g) => !g.is_available);
            if (unavailable.length > 0) {
                throw new common_1.ConflictException('Um ou mais presentes já foram escolhidos por outro convidado');
            }
            const total = gifts.reduce((sum, g) => sum + Number(g.price), 0);
            const order = queryRunner.manager.create(order_entity_1.Order, {
                guest_phone: phone,
                guest_name: dto.guest_name,
                guest_message: dto.guest_message || null,
                total,
                payment_method: dto.payment_method,
                payment_status: 'pending',
            });
            const savedOrder = await queryRunner.manager.save(order);
            const orderItems = gifts.map((gift) => queryRunner.manager.create(order_item_entity_1.OrderItem, {
                order_id: savedOrder.id,
                gift_id: gift.id,
                gift_name: gift.name,
                gift_price: gift.price,
            }));
            await queryRunner.manager.save(orderItems);
            let paymentResult;
            if (dto.payment_method === create_order_dto_1.PaymentMethodEnum.PIX) {
                const pixResult = await this.paymentGateway.createPixPayment({
                    orderId: savedOrder.id,
                    amount: total,
                    description: `Presente de casamento - Pedido #${savedOrder.id}`,
                });
                paymentResult = {
                    providerPaymentId: pixResult.providerPaymentId,
                    pixQrCode: pixResult.qrCode,
                    pixCopyPaste: pixResult.copyPasteCode,
                    expiresAt: pixResult.expiresAt,
                };
            }
            else {
                const cardResult = await this.paymentGateway.createCardPayment({
                    orderId: savedOrder.id,
                    amount: total,
                    description: `Presente de casamento - Pedido #${savedOrder.id}`,
                });
                paymentResult = {
                    providerPaymentId: cardResult.providerPaymentId,
                    status: cardResult.status,
                };
            }
            const payment = queryRunner.manager.create(payment_entity_1.Payment, {
                order_id: savedOrder.id,
                provider: 'mock',
                provider_payment_id: paymentResult.providerPaymentId,
                method: dto.payment_method,
                amount: total,
                status: 'pending',
                pix_qr_code: paymentResult.pixQrCode || null,
                pix_copy_paste: paymentResult.pixCopyPaste || null,
                expires_at: paymentResult.expiresAt || null,
            });
            await queryRunner.manager.save(payment);
            await queryRunner.commitTransaction();
            if (dto.payment_method === create_order_dto_1.PaymentMethodEnum.PIX) {
                return {
                    order_id: savedOrder.id,
                    total,
                    payment_method: 'pix',
                    pix_code: paymentResult.pixCopyPaste,
                    pix_qr_code: paymentResult.pixQrCode,
                    expires_at: paymentResult.expiresAt,
                };
            }
            return {
                order_id: savedOrder.id,
                total,
                payment_method: 'credit_card',
                status: paymentResult.status || 'processing',
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Order creation failed: ${error}`);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async findOne(id) {
        return this.orderRepository.findOne({
            where: { id },
            relations: ['items'],
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = OrdersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(3, (0, common_1.Inject)(payment_gateway_interface_1.PAYMENT_GATEWAY)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource,
        guests_service_1.GuestsService, Object])
], OrdersService);
//# sourceMappingURL=orders.service.js.map
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
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_entity_1 = require("./payment.entity");
const order_entity_1 = require("../orders/order.entity");
const order_item_entity_1 = require("../orders/order-item.entity");
const gift_entity_1 = require("../gifts/gift.entity");
let PaymentsService = PaymentsService_1 = class PaymentsService {
    constructor(paymentRepository, dataSource) {
        this.paymentRepository = paymentRepository;
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(PaymentsService_1.name);
    }
    async findByOrderId(orderId) {
        const payment = await this.paymentRepository.findOne({
            where: { order_id: orderId },
            order: { created_at: 'DESC' },
        });
        if (!payment) {
            throw new common_1.NotFoundException(`Pagamento para o pedido ${orderId} não encontrado`);
        }
        return payment;
    }
    async confirmPayment(orderId, cardLastFour, installments) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const order = await queryRunner.manager.findOne(order_entity_1.Order, {
                where: { id: orderId },
            });
            if (!order) {
                throw new common_1.NotFoundException('Pedido não encontrado');
            }
            if (order.payment_status === 'approved' || order.payment_status === 'confirmed') {
                throw new common_1.ConflictException('Este pedido já foi pago');
            }
            const orderItems = await queryRunner.manager.find(order_item_entity_1.OrderItem, {
                where: { order_id: orderId },
            });
            const giftIds = orderItems.map((i) => i.gift_id);
            const gifts = await queryRunner.manager.find(gift_entity_1.Gift, {
                where: { id: (0, typeorm_2.In)(giftIds) },
                lock: { mode: 'pessimistic_write' },
            });
            const unavailable = gifts.filter((g) => !g.is_available);
            if (unavailable.length > 0) {
                await queryRunner.manager.update(order_entity_1.Order, orderId, {
                    payment_status: 'cancelled',
                });
                await queryRunner.commitTransaction();
                throw new common_1.ConflictException('Infelizmente, um ou mais presentes já foram escolhidos enquanto você realizava o pagamento.');
            }
            for (const gift of gifts) {
                gift.is_available = false;
                await queryRunner.manager.save(gift);
            }
            const paymentId = `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
            await queryRunner.manager.update(order_entity_1.Order, orderId, {
                payment_status: 'confirmed',
                payment_id: paymentId,
            });
            const payment = await queryRunner.manager.findOne(payment_entity_1.Payment, {
                where: { order_id: orderId },
                order: { created_at: 'DESC' },
            });
            if (payment) {
                payment.status = 'approved';
                await queryRunner.manager.save(payment);
            }
            await queryRunner.commitTransaction();
            return {
                success: true,
                payment_id: paymentId,
                payment_method: order.payment_method,
                card_last_four: cardLastFour || null,
                installments: installments || 1,
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async approveByProviderPaymentId(providerPaymentId) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const payment = await queryRunner.manager.findOne(payment_entity_1.Payment, {
                where: { provider_payment_id: providerPaymentId },
            });
            if (!payment) {
                throw new common_1.NotFoundException(`Pagamento com provider_payment_id ${providerPaymentId} não encontrado`);
            }
            if (payment.status === 'approved') {
                this.logger.log(`Payment ${providerPaymentId} already approved — idempotent skip`);
                await queryRunner.commitTransaction();
                return;
            }
            payment.status = 'approved';
            await queryRunner.manager.save(payment);
            await queryRunner.manager.update(order_entity_1.Order, payment.order_id, {
                payment_status: 'approved',
                payment_id: providerPaymentId,
            });
            const orderItems = await queryRunner.manager.find(order_item_entity_1.OrderItem, {
                where: { order_id: payment.order_id },
            });
            const giftIds = orderItems.map((i) => i.gift_id);
            if (giftIds.length > 0) {
                const gifts = await queryRunner.manager.find(gift_entity_1.Gift, {
                    where: { id: (0, typeorm_2.In)(giftIds) },
                    lock: { mode: 'pessimistic_write' },
                });
                for (const gift of gifts) {
                    gift.is_available = false;
                    await queryRunner.manager.save(gift);
                }
            }
            await queryRunner.commitTransaction();
            this.logger.log(`Payment ${providerPaymentId} approved for order ${payment.order_id}`);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async rejectByProviderPaymentId(providerPaymentId) {
        const payment = await this.paymentRepository.findOne({
            where: { provider_payment_id: providerPaymentId },
        });
        if (!payment) {
            throw new common_1.NotFoundException(`Pagamento com provider_payment_id ${providerPaymentId} não encontrado`);
        }
        if (payment.status === 'approved') {
            this.logger.warn(`Cannot reject already approved payment ${providerPaymentId}`);
            return;
        }
        payment.status = 'failed';
        await this.paymentRepository.save(payment);
        await this.dataSource.manager.update(order_entity_1.Order, payment.order_id, {
            payment_status: 'failed',
        });
        this.logger.log(`Payment ${providerPaymentId} marked as failed for order ${payment.order_id}`);
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map
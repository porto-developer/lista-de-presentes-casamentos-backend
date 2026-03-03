import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, In } from 'typeorm';
import { Payment } from './payment.entity';
import { Order } from '../orders/order.entity';
import { OrderItem } from '../orders/order-item.entity';
import { Gift } from '../gifts/gift.entity';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly dataSource: DataSource,
  ) {}

  async findByOrderId(orderId: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { order_id: orderId },
      order: { created_at: 'DESC' },
    });
    if (!payment) {
      throw new NotFoundException(`Pagamento para o pedido ${orderId} não encontrado`);
    }
    return payment;
  }

  async confirmPayment(
    orderId: number,
    cardLastFour?: string,
    installments?: number,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await queryRunner.manager.findOne(Order, {
        where: { id: orderId },
      });

      if (!order) {
        throw new NotFoundException('Pedido não encontrado');
      }

      if (order.payment_status === 'approved' || order.payment_status === 'confirmed') {
        throw new ConflictException('Este pedido já foi pago');
      }

      const orderItems = await queryRunner.manager.find(OrderItem, {
        where: { order_id: orderId },
      });

      const giftIds = orderItems.map((i) => i.gift_id);
      const gifts = await queryRunner.manager.find(Gift, {
        where: { id: In(giftIds) },
        lock: { mode: 'pessimistic_write' },
      });

      const unavailable = gifts.filter((g) => !g.is_available);
      if (unavailable.length > 0) {
        await queryRunner.manager.update(Order, orderId, {
          payment_status: 'cancelled',
        });
        await queryRunner.commitTransaction();
        throw new ConflictException(
          'Infelizmente, um ou mais presentes já foram escolhidos enquanto você realizava o pagamento.',
        );
      }

      for (const gift of gifts) {
        gift.is_available = false;
        await queryRunner.manager.save(gift);
      }

      const paymentId = `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

      await queryRunner.manager.update(Order, orderId, {
        payment_status: 'confirmed',
        payment_id: paymentId,
      });

      const payment = await queryRunner.manager.findOne(Payment, {
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
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async approveByProviderPaymentId(providerPaymentId: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const payment = await queryRunner.manager.findOne(Payment, {
        where: { provider_payment_id: providerPaymentId },
      });

      if (!payment) {
        throw new NotFoundException(
          `Pagamento com provider_payment_id ${providerPaymentId} não encontrado`,
        );
      }

      if (payment.status === 'approved') {
        this.logger.log(`Payment ${providerPaymentId} already approved — idempotent skip`);
        await queryRunner.commitTransaction();
        return;
      }

      payment.status = 'approved';
      await queryRunner.manager.save(payment);

      await queryRunner.manager.update(Order, payment.order_id, {
        payment_status: 'approved',
        payment_id: providerPaymentId,
      });

      const orderItems = await queryRunner.manager.find(OrderItem, {
        where: { order_id: payment.order_id },
      });

      const giftIds = orderItems.map((i) => i.gift_id);
      if (giftIds.length > 0) {
        const gifts = await queryRunner.manager.find(Gift, {
          where: { id: In(giftIds) },
          lock: { mode: 'pessimistic_write' },
        });

        for (const gift of gifts) {
          gift.is_available = false;
          await queryRunner.manager.save(gift);
        }
      }

      await queryRunner.commitTransaction();
      this.logger.log(`Payment ${providerPaymentId} approved for order ${payment.order_id}`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async rejectByProviderPaymentId(providerPaymentId: string): Promise<void> {
    const payment = await this.paymentRepository.findOne({
      where: { provider_payment_id: providerPaymentId },
    });

    if (!payment) {
      throw new NotFoundException(
        `Pagamento com provider_payment_id ${providerPaymentId} não encontrado`,
      );
    }

    if (payment.status === 'approved') {
      this.logger.warn(`Cannot reject already approved payment ${providerPaymentId}`);
      return;
    }

    payment.status = 'failed';
    await this.paymentRepository.save(payment);

    await this.dataSource.manager.update(Order, payment.order_id, {
      payment_status: 'failed',
    });

    this.logger.log(`Payment ${providerPaymentId} marked as failed for order ${payment.order_id}`);
  }
}

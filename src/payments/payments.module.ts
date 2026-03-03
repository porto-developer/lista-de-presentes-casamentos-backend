import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PaymentGatewayProvider } from './gateways/payment-gateway.factory';

@Module({
  imports: [TypeOrmModule.forFeature([Payment])],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentGatewayProvider],
  exports: [PaymentsService, PaymentGatewayProvider],
})
export class PaymentsModule {}

import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import {
  PaymentStatusResponseDto,
  PaymentConfirmResponseDto,
} from './dto/payment-response.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get(':orderId')
  @ApiOperation({ summary: 'Retorna status do pagamento de um pedido' })
  @ApiResponse({ status: 200, type: PaymentStatusResponseDto })
  @ApiResponse({ status: 404, description: 'Pagamento não encontrado' })
  findByOrderId(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.paymentsService.findByOrderId(orderId);
  }

  @Post(':orderId/confirm')
  @ApiOperation({ summary: 'Confirma pagamento manualmente (fallback)' })
  @ApiResponse({ status: 200, type: PaymentConfirmResponseDto })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
  @ApiResponse({ status: 409, description: 'Pedido já pago ou presente indisponível' })
  confirm(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() dto: ConfirmPaymentDto,
  ) {
    return this.paymentsService.confirmPayment(
      orderId,
      dto.card_last_four,
      dto.installments,
    );
  }
}

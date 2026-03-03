import { Controller, Post, Body, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WebhookService } from './webhook.service';

@ApiTags('Webhook')
@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('payment')
  @ApiOperation({ summary: 'Recebe eventos de pagamento do gateway' })
  @ApiResponse({ status: 200, description: 'Webhook processado' })
  @ApiResponse({ status: 400, description: 'Payload ou assinatura inválidos' })
  handlePayment(
    @Body() payload: Record<string, unknown>,
    @Headers('x-webhook-signature') signature: string,
  ) {
    return this.webhookService.handlePaymentWebhook(payload, signature);
  }
}

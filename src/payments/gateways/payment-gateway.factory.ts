import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PAYMENT_GATEWAY } from './payment-gateway.interface';
import { MockPaymentProvider } from './mock-payment.provider';
import { AsaasPaymentProvider } from './asaas-payment.provider';

export const PaymentGatewayProvider: Provider = {
  provide: PAYMENT_GATEWAY,
  useFactory: (configService: ConfigService) => {
    const provider = configService.get<string>('PAYMENT_PROVIDER', 'mock');

    switch (provider) {
      case 'asaas':
        return new AsaasPaymentProvider(
          configService.getOrThrow<string>('ASAAS_API_URL'),
          configService.getOrThrow<string>('ASAAS_API_KEY'),
          configService.getOrThrow<string>('ASAAS_AUTH_TOKEN'),
        );
      case 'mock':
      default:
        return new MockPaymentProvider();
    }
  },
  inject: [ConfigService],
};

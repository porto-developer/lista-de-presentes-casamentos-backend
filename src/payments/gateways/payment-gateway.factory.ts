import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PAYMENT_GATEWAY } from './payment-gateway.interface';
import { MockPaymentProvider } from './mock-payment.provider';

export const PaymentGatewayProvider: Provider = {
  provide: PAYMENT_GATEWAY,
  useFactory: (configService: ConfigService) => {
    const provider = configService.get<string>('PAYMENT_PROVIDER', 'mock');

    switch (provider) {
      case 'mock':
      default:
        return new MockPaymentProvider();
    }
  },
  inject: [ConfigService],
};

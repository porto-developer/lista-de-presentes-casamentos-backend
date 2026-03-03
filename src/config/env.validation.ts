import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';

export enum PaymentProvider {
  MOCK = 'mock',
  MERCADO_PAGO = 'mercado_pago',
  STRIPE = 'stripe',
}

export class EnvironmentVariables {
  @IsString()
  DATABASE_HOST: string;

  @IsNumber()
  DATABASE_PORT: number;

  @IsString()
  DATABASE_USER: string;

  @IsString()
  DATABASE_PASSWORD: string;

  @IsString()
  DATABASE_NAME: string;

  @IsNumber()
  PORT: number;

  @IsEnum(PaymentProvider)
  PAYMENT_PROVIDER: PaymentProvider;

  @IsString()
  WEBHOOK_SECRET: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}

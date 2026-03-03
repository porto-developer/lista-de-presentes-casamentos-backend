import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  IsEnum,
  IsOptional,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  gift_id: number;

  @ApiProperty({ example: 'Jogo de Panelas' })
  @IsString()
  @IsNotEmpty()
  gift_name: string;

  @ApiProperty({ example: 299.9 })
  @IsNumber()
  gift_price: number;
}

export enum PaymentMethodEnum {
  PIX = 'pix',
  CREDIT_CARD = 'credit_card',
}

export class CreateOrderDto {
  @ApiProperty({ example: 'João da Silva' })
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  guest_name: string;

  @ApiProperty({ example: '11999998888' })
  @IsString()
  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  guest_phone: string;

  @ApiProperty({ example: 'Parabéns aos noivos!', required: false })
  @IsOptional()
  @IsString()
  guest_message?: string;

  @ApiProperty({ enum: PaymentMethodEnum, example: 'pix' })
  @IsEnum(PaymentMethodEnum, { message: 'Método de pagamento deve ser pix ou credit_card' })
  payment_method: PaymentMethodEnum;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ArrayMinSize(1, { message: 'Pedido deve conter ao menos 1 item' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

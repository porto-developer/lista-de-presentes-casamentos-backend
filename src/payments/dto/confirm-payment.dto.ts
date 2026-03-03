import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class ConfirmPaymentDto {
  @ApiProperty({ example: 'pix', required: false })
  @IsOptional()
  @IsString()
  payment_method?: string;

  @ApiProperty({ example: '1234', required: false })
  @IsOptional()
  @IsString()
  card_last_four?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  installments?: number;
}

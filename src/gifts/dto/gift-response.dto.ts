import { ApiProperty } from '@nestjs/swagger';

export class GiftResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true })
  description: string | null;

  @ApiProperty()
  price: number;

  @ApiProperty({ nullable: true })
  image_url: string | null;

  @ApiProperty({ nullable: true })
  category: string | null;

  @ApiProperty()
  is_available: boolean;

  @ApiProperty()
  created_at: Date;
}

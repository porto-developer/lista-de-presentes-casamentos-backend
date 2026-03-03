import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GiftsService } from './gifts.service';
import { GiftResponseDto } from './dto/gift-response.dto';

@ApiTags('Gifts')
@Controller('gifts')
export class GiftsController {
  constructor(private readonly giftsService: GiftsService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todos os presentes' })
  @ApiResponse({ status: 200, type: [GiftResponseDto] })
  findAll() {
    return this.giftsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhe de um presente' })
  @ApiResponse({ status: 200, type: GiftResponseDto })
  @ApiResponse({ status: 404, description: 'Presente não encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.giftsService.findOne(id);
  }
}

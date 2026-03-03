import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gift } from './gift.entity';

@Injectable()
export class GiftsService {
  constructor(
    @InjectRepository(Gift)
    private readonly giftRepository: Repository<Gift>,
  ) {}

  async findAll(): Promise<Gift[]> {
    return this.giftRepository.find({
      order: { category: 'ASC', name: 'ASC' },
    });
  }

  async findAvailable(): Promise<Gift[]> {
    return this.giftRepository.find({
      where: { is_available: true },
      order: { category: 'ASC', name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Gift> {
    const gift = await this.giftRepository.findOne({ where: { id } });
    if (!gift) {
      throw new NotFoundException(`Presente com ID ${id} não encontrado`);
    }
    return gift;
  }
}

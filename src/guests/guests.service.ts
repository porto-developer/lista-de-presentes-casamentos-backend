import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';
import { Guest } from './guest.entity';

@Injectable()
export class GuestsService {
  constructor(
    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>,
  ) {}

  async upsert(
    name: string,
    phone: string,
    queryRunner?: QueryRunner,
  ): Promise<Guest> {
    const repo = queryRunner
      ? queryRunner.manager.getRepository(Guest)
      : this.guestRepository;

    const existing = await repo.findOne({ where: { phone } });

    if (existing) {
      existing.name = name;
      return repo.save(existing);
    }

    const guest = repo.create({ name, phone });
    return repo.save(guest);
  }
}

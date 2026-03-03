import { Repository, QueryRunner } from 'typeorm';
import { Guest } from './guest.entity';
export declare class GuestsService {
    private readonly guestRepository;
    constructor(guestRepository: Repository<Guest>);
    upsert(name: string, phone: string, queryRunner?: QueryRunner): Promise<Guest>;
}

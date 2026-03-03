import { Repository } from 'typeorm';
import { Gift } from './gift.entity';
export declare class GiftsService {
    private readonly giftRepository;
    constructor(giftRepository: Repository<Gift>);
    findAll(): Promise<Gift[]>;
    findAvailable(): Promise<Gift[]>;
    findOne(id: number): Promise<Gift>;
}

import { GiftsService } from './gifts.service';
export declare class GiftsController {
    private readonly giftsService;
    constructor(giftsService: GiftsService);
    findAll(): Promise<import("./gift.entity").Gift[]>;
    findOne(id: number): Promise<import("./gift.entity").Gift>;
}

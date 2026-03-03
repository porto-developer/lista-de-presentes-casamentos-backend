import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guest } from './guest.entity';
import { GuestsService } from './guests.service';

@Module({
  imports: [TypeOrmModule.forFeature([Guest])],
  providers: [GuestsService],
  exports: [GuestsService],
})
export class GuestsModule {}

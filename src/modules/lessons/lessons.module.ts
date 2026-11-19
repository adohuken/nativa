import { Module } from '@nestjs/common';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';
import { KrashenEngineService } from '../progress/krashen-engine.service';

@Module({
  controllers: [LessonsController],
  providers: [LessonsService, KrashenEngineService],
  exports: [LessonsService, KrashenEngineService],
})
export class LessonsModule {}

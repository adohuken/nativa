import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { CurrentUser } from '../../core/decorators/auth.decorators';

@Controller('lessons')
@UseGuards(JwtAuthGuard)
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get('next-input')
  async getNextInputLesson(@CurrentUser('sub') userId: string) {
    return this.lessonsService.getNextComprehensibleInput(userId);
  }

  @Get(':id')
  async getLesson(
    @Param('id') lessonId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.lessonsService.getLessonWithUserProgress(lessonId, userId);
  }

  @Post(':id/complete')
  async completeLesson(
    @Param('id') lessonId: string,
    @CurrentUser('sub') userId: string,
    @Body('score') score: number,
  ) {
    return this.lessonsService.completeLesson(userId, lessonId, score || 100);
  }
}

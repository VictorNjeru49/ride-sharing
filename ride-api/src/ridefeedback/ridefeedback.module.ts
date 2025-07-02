import { Module } from '@nestjs/common';
import { RidefeedbackService } from './ridefeedback.service';
import { RidefeedbackController } from './ridefeedback.controller';

@Module({
  controllers: [RidefeedbackController],
  providers: [RidefeedbackService],
})
export class RidefeedbackModule {}

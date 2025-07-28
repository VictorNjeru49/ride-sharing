import { Module } from '@nestjs/common';
import { RidefeedbackService } from './ridefeedback.service';
import { RidefeedbackController } from './ridefeedback.controller';
import { User } from 'src/users/entities/user.entity';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ridefeedback } from './entities/ridefeedback.entity';
import { Riderequest } from 'src/riderequest/entities/riderequest.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Ridefeedback, Riderequest, User]),
  ],
  controllers: [RidefeedbackController],
  providers: [RidefeedbackService],
})
export class RidefeedbackModule {}

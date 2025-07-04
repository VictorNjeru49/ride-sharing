import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Ride } from 'src/ride/entities/ride.entity';
import { User } from 'src/users/entities/user.entity';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Payment, User, Ride])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}

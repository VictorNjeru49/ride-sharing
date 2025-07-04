import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Admin } from 'src/admin/entities/admin.entity';
import { Device } from 'src/device/entities/device.entity';
import { Driverlocation } from 'src/driverlocation/entities/driverlocation.entity';
import { Driverprofile } from 'src/driverprofile/entities/driverprofile.entity';
import { Notification } from 'src/notification/entities/notification.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { Promocode } from 'src/promocode/entities/promocode.entity';
import { Rating } from 'src/ratings/entities/rating.entity';
import { Ride } from 'src/ride/entities/ride.entity';
import { Ridefeedback } from 'src/ridefeedback/entities/ridefeedback.entity';
import { Riderequest } from 'src/riderequest/entities/riderequest.entity';
import { Riderprofile } from 'src/riderprofile/entities/riderprofile.entity';
import { Supportticket } from 'src/supportticket/entities/supportticket.entity';
import { Userpromousage } from 'src/userpromousage/entities/userpromousage.entity';
import { Wallet } from 'src/wallets/entities/wallet.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([
      User,
      Admin,
      Driverlocation,
      Device,
      Driverprofile,
      Notification,
      Payment,
      Promocode,
      Rating,
      Ride,
      Ridefeedback,
      Riderequest,
      Riderprofile,
      Supportticket,
      Userpromousage,
      Wallet,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}

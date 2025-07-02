import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { LocationsModule } from './locations/locations.module';
import { WalletsModule } from './wallets/wallets.module';
import { AuthModule } from './auth/auth.module';
import { PaymentsModule } from './payments/payments.module';
import { RiderprofileModule } from './riderprofile/riderprofile.module';
import { DriverprofileModule } from './driverprofile/driverprofile.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { RideModule } from './ride/ride.module';
import { RatingsModule } from './ratings/ratings.module';
import { RiderequestModule } from './riderequest/riderequest.module';
import { DriverlocationModule } from './driverlocation/driverlocation.module';
import { RidecancelModule } from './ridecancel/ridecancel.module';
import { RidefeedbackModule } from './ridefeedback/ridefeedback.module';
import { SupportticketModule } from './supportticket/supportticket.module';
import { NotificationModule } from './notification/notification.module';
import { PromocodeModule } from './promocode/promocode.module';
import { UserpromousageModule } from './userpromousage/userpromousage.module';
import { DeviceModule } from './device/device.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    UsersModule,
    LocationsModule,
    WalletsModule,
    AuthModule,
    PaymentsModule,
    RiderprofileModule,
    DriverprofileModule,
    VehicleModule,
    RideModule,
    RatingsModule,
    RiderequestModule,
    DriverlocationModule,
    RidecancelModule,
    RidefeedbackModule,
    SupportticketModule,
    NotificationModule,
    PromocodeModule,
    UserpromousageModule,
    DeviceModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

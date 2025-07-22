import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from './dto';
import { randomInt } from 'crypto';

export interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}
@Injectable()
export class AuthService {
  private readonly otpStore = new Map<
    string,
    { code: string; expiresAt: Date }
  >();
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private async getToken(userId: string, email: string, role: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email: email, role: role },
        {
          secret: this.configService.getOrThrow<string>('ACCESS_TOKEN_SECRET'),
          expiresIn: this.configService.getOrThrow<string>(
            'ACCESS_TOKEN_EXPIRES_IN',
          ),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email: email,
          role: role,
        },
        {
          secret: this.configService.getOrThrow<string>('REFRESH_TOKEN_SECRET'),
          expiresIn: this.configService.getOrThrow<string>(
            'REFRESH_TOKEN_EXPIRES_IN',
          ),
        },
      ),
    ]);

    return { accessToken: at, refreshToken: rt };
  }

  async socialLogin(socialData: {
    provider: string;
    providerId: string;
    email: string;
    firstName: string;
    lastName: string;
    picture?: string;
  }) {
    let user = await this.userRepo.findOne({
      where: { email: socialData.email },
    });

    // If user doesn't exist, create one
    if (!user) {
      user = this.userRepo.create({
        email: socialData.email,
        firstName: socialData.firstName,
        lastName: socialData.lastName,
        profilePicture: socialData.picture,
        provider: socialData.provider,
        providerId: socialData.providerId,
        password: '',
      });
      user = await this.userRepo.save(user);
    }
    const { accessToken, refreshToken } = await this.getToken(
      user.id,
      user.email,
      user.role,
    );
    await this.saveRefreshToken(user.id, refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
      },
      tokens: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    };
  }

  private async hashData(data: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(data, salt);
  }
  private async saveRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.userRepo.update(userId, {
      hashedRefreshToken: hashedRefreshToken,
    });
  }

  async forgetPassword(emailOrPhone: string) {
    const user = await this.userRepo.findOne({
      where: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });

    if (!user) {
      throw new NotFoundException(
        `User with email/phone ${emailOrPhone} not found`,
      );
    }

    // ✅ Generate OTP
    const otp = randomInt(100000, 999999).toString();

    // ✅ Save OTP in memory
    this.saveOtp(user.phone, otp, 5 * 60 * 1000); // 5 minutes

    // ✅ Send OTP (log or integrate SMS provider)
    await this.sendOtpSms(user.phone, otp);

    return {
      message: `OTP sent to phone ${user.phone}`,
      user: {
        id: user.id,
        phone: user.phone,
      },
    };
  }

  private saveOtp(phone: string, code: string, expiresInMs: number) {
    const expiresAt = new Date(Date.now() + expiresInMs);
    this.otpStore.set(phone, { code, expiresAt });
  }

  private async sendOtpSms(phone: string, otp: string) {
    // Replace this with your SMS provider (e.g. Twilio, Africa's Talking, etc.)
    await new Promise((resolve) => setTimeout(resolve, 100));
    console.log(`📱 Sending OTP "${otp}" to phone number: ${phone}`);
  }

  private verifyOtp(phone: string, code: string): boolean {
    const entry = this.otpStore.get(phone);
    if (!entry) return false;

    const { code: storedCode, expiresAt } = entry;

    if (Date.now() > expiresAt.getTime()) {
      this.otpStore.delete(phone);
      return false;
    }

    return storedCode === code;
  }

  async verifyPhoneOtp(phone: string, otp: string) {
    const isValid = this.verifyOtp(phone, otp);
    if (!isValid) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    const user = await this.userRepo.findOne({ where: { phone } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const resetToken = await this.jwtService.signAsync(
      { sub: user.id, email: user.email },
      {
        secret: this.configService.getOrThrow('RESET_FORGET_PASSWORD_SECRET'),
        expiresIn: this.configService.getOrThrow(
          'RESET_FORGET_PASSWORD_SECRET_EXPIRES_IN',
        ),
      },
    );

    return {
      message: 'Phone verified successfully',
      resetToken,
    };
  }

  async logIn(createAuthDto: CreateAuthDto) {
    const email = createAuthDto.email;
    const foundUser = await this.userRepo.findOne({ where: { email } });

    if (!foundUser) {
      throw new NotFoundException(
        `User with email ${createAuthDto.email} not found`,
      );
    }

    const verifyPassword = await bcrypt.compare(
      createAuthDto.password,
      foundUser.password,
    );
    if (!verifyPassword) {
      throw new NotFoundException(`Invalid credentials`);
    }

    const { accessToken, refreshToken } = await this.getToken(
      foundUser.id,
      foundUser.email,
      foundUser.role,
    );
    await this.saveRefreshToken(foundUser.id, refreshToken);
    return {
      user: {
        id: foundUser.id,
        role: foundUser.role,
        email: foundUser.email,
        phone: foundUser.phone,
      },
      tokens: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    };
  }
  async saveRefreshTokens(id: string, refreshToken: string) {
    const foundUser = await this.userRepo.findOne({
      where: { id },
      select: ['id', 'email', 'hashedRefreshToken'],
    });

    if (!foundUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (!foundUser.hashedRefreshToken) {
      throw new NotFoundException('No refresh token stored for this user');
    }

    const isValidToken = await bcrypt.compare(
      foundUser.hashedRefreshToken,
      refreshToken,
    );
    if (!isValidToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const { accessToken, refreshToken: newRefreshToken } = await this.getToken(
      foundUser.id,
      foundUser.email,
      foundUser.role,
    );
    const hashedToken = await bcrypt.hash(newRefreshToken, 10);
    await this.saveRefreshToken(foundUser.id, hashedToken);

    return {
      user: {
        id: foundUser.id,
        role: foundUser.role,
        email: foundUser.email,
        phone: foundUser?.phone,
      },
      tokens: {
        accessToken: accessToken,
        refreshToken: newRefreshToken,
      },
    };
  }

  async logOut(userId: string) {
    const res = await this.userRepo.findOne({
      where: { id: userId },
      select: ['id', 'email', 'password', 'role'],
    });
    if (!res) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    await this.userRepo.update(userId, {
      hashedRefreshToken: '',
    });

    return { message: `User with id : ${userId} signed out successfully` };
  }
}

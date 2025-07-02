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

export interface JwtPayload {
  sub: number;
  email: string;
  phone: string;
  iat?: number;
  exp?: number;
}
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private async getToken(
    userId: string,
    email: string,
    role: string,
    phone: string,
  ) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email: email, role: role, phone: phone },
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
      foundUser.phone,
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
      foundUser.phone,
    );
    const hashedToken = await bcrypt.hash(newRefreshToken, 10);
    await this.saveRefreshToken(foundUser.id, hashedToken);

    return {
      user: {
        id: foundUser.id,
        role: foundUser.role,
        email: foundUser.email,
        phone: foundUser.phone,
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

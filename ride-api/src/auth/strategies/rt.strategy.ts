import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';

interface JwtPayload {
  sub: string;
  email: string;
  [key: string]: any;
}

interface JwtPayloadWithRt extends JwtPayload {
  refreshToken: string;
}

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-rt') {
  constructor(private readonly configService: ConfigService) {
    const options: StrategyOptionsWithRequest = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow('REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    };
    super(options);
  }

  validate(req: Request, payload: JwtPayload): JwtPayloadWithRt {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
      throw new Error('No refresh token provided');
    }
    const refreshToken = authHeader.replace('Bearer ', '').trim();
    if (!refreshToken) {
      throw new Error('Invalid refresh token format');
    }
    return {
      ...payload,
      refreshToken,
    };
  }
}

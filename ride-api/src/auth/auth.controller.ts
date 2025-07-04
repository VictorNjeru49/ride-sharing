import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';

interface RequestWithUser extends Request {
  user: {
    sub: string;
    email: string;
    refreshToken: string;
  };
}
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('login')
  SignIn(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.logIn(createAuthDto);
  }
  @Public()
  @Get('logout/:id')
  SignOut(@Param('id') id: string) {
    return this.authService.logOut(id);
  }
  @Public()
  @Get('refresh')
  refreshToken(@Param('id') id: string, @Req() req: RequestWithUser) {
    const user = req.user;
    if (user.sub !== id) {
      throw new UnauthorizedException("userId doesn't match");
    }
    return this.authService.saveRefreshTokens(id, user.refreshToken);
  }
}

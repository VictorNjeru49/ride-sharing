import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from '../auth.service';
import { rolekeys } from '../decorators/role.decorator';

interface UserRequest extends Request {
  user?: JwtPayload;
}
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const initateRole = this.reflector.getAllAndOverride<UserRole[]>(rolekeys, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!initateRole) {
      return true;
    }

    const res = context.switchToHttp().getRequest<UserRequest>();
    const user = res.user;

    if (!user) {
      return false;
    }
    const userpro = await this.userRepo.findOne({
      where: { id: user.sub },
      select: ['id', 'role'],
    });

    if (!userpro) {
      return false;
    }

    return initateRole.some((roles) => userpro.role == roles);
  }
}

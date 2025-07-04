import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/users/entities/user.entity';

export const rolekeys = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(rolekeys, roles);

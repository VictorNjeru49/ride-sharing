import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AtGuard } from 'src/auth/guards';
import { Public } from 'src/auth/decorators/public.decorator';
import { User } from './entities/user.entity';

@UseGuards(AtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  @Public()
  @Get()
  findAll(search?: string) {
    return this.usersService.findAll(search);
  }
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Public()
  @Get(':identifier')
  async findByIdOrEmail(
    @Param('identifier') identifier: string,
  ): Promise<User> {
    try {
      const user = await this.usersService.findByIdOrEmail(identifier);
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      // Handle or rethrow other errors as needed
      throw error;
    }
  }

  @Public()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
  @Public()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}

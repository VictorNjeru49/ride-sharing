import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}
  private async hashData(data: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(data, salt);
  }

  async create(createUserDto: CreateUserDto): Promise<Partial<User>> {
    const existingUser = await this.userRepo.findOne({
      where: { email: createUserDto.email },
      select: ['id'],
    });
    if (existingUser) {
      throw new Error(
        `Profile with email ${createUserDto.email} already exists`,
      );
    }
    const hashedPassword = await this.hashData(createUserDto.password);
    const user = this.userRepo.create({
      ...createUserDto,
      password: hashedPassword,
    });
    const savedProfile = await this.userRepo.save(user);

    return savedProfile;
  }

  async findAll(search?: string): Promise<User[]> {
    let users: User[];
    if (search) {
      console.log(
        `This action returns all users matching the search term: ${search}`,
      );
      users = await this.userRepo.find({
        where: [{ firstName: search }, { lastName: search }, { email: search }],
      });
    } else {
      console.log(`This action returns all users`);
      users = await this.userRepo.find({
        relations: [
          'adminProfile',
          'riderProfile',
          'driverProfile',
          'payments',
          'ratingsGiven',
          'ratingsReceived',
          'walletTransactions',
          'rideFeedbacks',
          'supportTickets',
          'notifications',
          'devices',
          'promoUsages',
          'createdPromoCodes',
          'driverLocations',
        ],
      });
    }

    return users;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.password) {
      updateUserDto.password = await this.hashData(updateUserDto.password);
    }

    await this.userRepo.update(user.id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    console.log(`the user with id: ${id}`);
    await this.userRepo.delete(user);
  }
}

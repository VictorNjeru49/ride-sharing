import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>,
  ) {}

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    const { userId, role, permission } = createAdminDto;

    // Check if user exists
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    // Check if Admin profile already exists for this user
    const existingAdmin = await this.adminRepo.findOne({
      where: { userId },
    });
    if (existingAdmin) {
      throw new Error('Admin profile already exists for this user');
    }

    // Create new Admin entity
    const admin = this.adminRepo.create({
      user,
      userId,
      role,
      permission: permission || [],
    });

    return await this.adminRepo.save(admin);
  }

  async findAll(): Promise<Admin[]> {
    return await this.adminRepo.find({ relations: ['user'] });
  }

  async findOne(id: string): Promise<Admin | null> {
    return await this.adminRepo.findOne({ where: { id }, relations: ['user'] });
  }

  async update(id: string, updateAdminDto: UpdateAdminDto): Promise<Admin> {
    const admin = await this.adminRepo.findOne({ where: { id } });
    if (!admin) {
      throw new NotFoundException(`Admin with id ${id} not found`);
    }

    // Update fields
    Object.assign(admin, updateAdminDto);

    return this.adminRepo.save(admin);
  }

  async remove(id: string): Promise<void> {
    const admin = await this.adminRepo.findOne({ where: { id } });
    if (!admin) {
      throw new NotFoundException(`Admin with id ${id} not found`);
    }
    await this.adminRepo.remove(admin);
  }
}

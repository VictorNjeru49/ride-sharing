import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDriverprofileDto } from './dto/create-driverprofile.dto';
import { UpdateDriverprofileDto } from './dto/update-driverprofile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Driverprofile } from './entities/driverprofile.entity';
import { Repository } from 'typeorm';
import { User, UserRole } from 'src/users/entities/user.entity';

@Injectable()
export class DriverprofileService {
  constructor(
    @InjectRepository(Driverprofile)
    private readonly driverprofileRepo: Repository<Driverprofile>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // Create user and driver profile if role is driver
  async createUserWithDriverProfile(
    userData: Partial<User>,
    driverProfileData: Partial<CreateDriverprofileDto>,
  ): Promise<Driverprofile> {
    if (userData.role !== UserRole.DRIVER) {
      throw new BadRequestException(
        'User role must be driver to create driver profile',
      );
    }

    // Create user first
    const user = this.userRepo.create(userData);
    const savedUser = await this.userRepo.save(user);

    // Create driver profile linked to user
    const driverprofile = this.driverprofileRepo.create({
      ...driverProfileData,
      user: savedUser,
    });

    const savedDriverProfile = await this.driverprofileRepo.save(driverprofile);
    return savedDriverProfile;
  }

  async create(createDriverprofileDto: CreateDriverprofileDto) {
    const driverprofile = this.driverprofileRepo.create(createDriverprofileDto);
    return await this.driverprofileRepo.save(driverprofile);
  }

  async findAll() {
    return await this.driverprofileRepo.find({
      relations: [
        'user',
        'vehicle',
        'ridesOffered',
        'ridesTaken',
        'assignedRequests',
        'locationHistory',
      ],
    });
  }

  async findOne(id: string) {
    return await this.driverprofileRepo.findOne({
      where: { id },
      relations: [
        'user',
        'vehicle',
        'ridesOffered',
        'ridesTaken',
        'assignedRequests',
        'locationHistory',
      ],
    });
  }

  async update(id: string, updateDriverprofileDto: UpdateDriverprofileDto) {
    await this.driverprofileRepo.update(id, updateDriverprofileDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    return await this.driverprofileRepo.delete(id);
  }
}

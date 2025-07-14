import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRiderprofileDto } from './dto/create-riderprofile.dto';
import { UpdateRiderprofileDto } from './dto/update-riderprofile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Riderprofile } from './entities/riderprofile.entity';
import { Repository } from 'typeorm';
import { User, UserRole } from 'src/users/entities/user.entity';

@Injectable()
export class RiderprofileService {
  constructor(
    @InjectRepository(Riderprofile)
    private readonly riderprofileRepo: Repository<Riderprofile>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async createUserWithRiderProfile(
    userData: Partial<User>,
    riderProfileData: Partial<CreateRiderprofileDto>,
  ) {
    if (userData.role !== UserRole.RIDER) {
      throw new BadRequestException(
        'User role must be rider to create rider profile',
      );
    }

    // Create user first
    const user = this.userRepo.create(userData);
    const savedUser = await this.userRepo.save(user);

    // Create rider profile linked to user
    const riderprofile = this.riderprofileRepo.create({
      ...riderProfileData,
      user: savedUser,
    });

    const savedRiderProfile = await this.riderprofileRepo.save(riderprofile);
    return savedRiderProfile;
  }

  async create(createRiderprofileDto: CreateRiderprofileDto) {
    const riderprofile = this.riderprofileRepo.create(createRiderprofileDto);
    return await this.riderprofileRepo.save(riderprofile);
  }

  async findAll() {
    return await this.riderprofileRepo.find({
      relations: ['user', 'rideRequests', 'ridesTaken'],
    });
  }

  async findOne(id: string) {
    return await this.riderprofileRepo.findOne({
      where: { id },
      relations: ['user', 'rideRequests', 'ridesTaken', 'riderHistory'],
    });
  }

  async update(id: string, updateRiderprofileDto: UpdateRiderprofileDto) {
    await this.riderprofileRepo.update(id, updateRiderprofileDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    return await this.riderprofileRepo.delete(id);
  }
}

import { Injectable } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Rating } from './entities/rating.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepo: Repository<Rating>,
  ) {}

  async create(createRatingDto: CreateRatingDto) {
    const rating = this.ratingRepo.create(createRatingDto);
    return await this.ratingRepo.save(rating);
  }

  async findAll() {
    return await this.ratingRepo.find({
      relations: { ride: true, rater: true, ratee: true },
    });
  }

  async findOne(id: string) {
    return await this.ratingRepo.findOne({
      where: { id },
      relations: { ride: true, rater: true, ratee: true },
    });
  }

  async update(id: string, updateRatingDto: UpdateRatingDto) {
    await this.ratingRepo.update(id, updateRatingDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    return await this.ratingRepo.delete(id);
  }
}

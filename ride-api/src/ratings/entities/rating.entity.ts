import { Ride } from 'src/ride/entities/ride.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
@Entity()
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Ride, (r) => r.ratings) ride: Ride;
  @ManyToOne(() => User, (u) => u.ratingsGiven) rater: User;
  @ManyToOne(() => User, (u) => u.ratingsReceived) ratee: User;
  @Column('int')
  score: number;

  @Column({ nullable: true })
  comment: string;

  @CreateDateColumn()
  createdAt: Date;
}

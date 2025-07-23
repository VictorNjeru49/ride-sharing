import { Ride } from 'src/ride/entities/ride.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Ridefeedback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  feedbackText: string;

  @CreateDateColumn()
  submittedAt: Date;

  @ManyToOne(() => User, (user) => user.rideFeedbacks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Ride, (ride) => ride.feedbacks, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'rideId' })
  ride: Ride;
}

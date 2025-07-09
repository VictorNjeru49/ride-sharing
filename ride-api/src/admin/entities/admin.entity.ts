import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  // OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum superRole {
  MODERATOR = 'moderator',
  SUPERVISOR = 'supervisor',
  SUPERADMIN = 'superadmin',
}

@Entity()
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true })
  userId: string;

  @Column()
  role: superRole;

  @Column('text', { nullable: true, array: true })
  permission: string[];

  @OneToOne(() => User, (user) => user.adminProfile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;
}

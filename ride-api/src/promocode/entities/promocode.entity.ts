import { Userpromousage } from 'src/userpromousage/entities/userpromousage.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Promocode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  discountAmount: number;

  @Column({ type: 'int' })
  usageLimit: number;

  @Column({ type: 'timestamp' })
  expirationDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Userpromousage, (usage) => usage.promoCode)
  usages: Userpromousage[];
  @ManyToOne(() => User, (user) => user.createdPromoCodes, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'createdById' }) // optional but explicit
  createdBy: User;
}

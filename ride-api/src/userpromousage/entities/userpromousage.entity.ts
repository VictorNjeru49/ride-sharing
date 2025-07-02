import { Promocode } from 'src/promocode/entities/promocode.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Userpromousage {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  usedAt: Date;

  @ManyToOne(() => User, (user) => user.promoUsages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Promocode, (promo) => promo.usages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'promoCodeId' })
  promoCode: Promocode;
}

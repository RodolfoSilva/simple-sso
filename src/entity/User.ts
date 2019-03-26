import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Organization } from './Organization';

@Entity()
@Unique(['email', 'organization'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ length: 255 })
  email: string;

  @Column({ select: false })
  password: string;

  @ManyToOne(type => Organization, {
    onDelete: 'CASCADE',
  })
  organization: Organization;

  @CreateDateColumn({ precision: 3 })
  createdAt: Date;

  @UpdateDateColumn({ precision: 3 })
  updatedAt: Date;
}

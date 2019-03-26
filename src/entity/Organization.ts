import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from './User';
import { Application } from './Application';

@Entity()
@Unique(['name'])
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  name: string;

  @CreateDateColumn({ precision: 3 })
  createdAt: Date;

  @UpdateDateColumn({ precision: 3 })
  updatedAt: Date;

  // ---

  @ManyToMany(type => User, user => user.organization, {
    cascade: true,
  })
  users: Application[];

  @ManyToMany(type => Application)
  @JoinTable()
  applications: Application[];
}

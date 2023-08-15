import { Audit } from "src/shared/entities/audit.entity";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn, 
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Account } from "./account.entity";

@Entity({ name: "users" })
export class User extends Audit {
   @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column()
  title: string;
  
  @Column()
  bio: string;
  
  @Column()
  profilePicture: string;
  
  @Column()
  country: string;
  
  @Column()
  city: string;
  
  @Column()
  phoneNumber: string;
  
  @Column()
  rank: number;
  
  @Column()
  score: number;
  
  @OneToOne(() => Account, (account) => account.user, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'accountId' })
  public accountId: string;
  }
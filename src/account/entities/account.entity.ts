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
} from "typeorm";
import { User } from "./user.entity";

@Entity({ name: "accounts" })
export class Account extends Audit {
   @PrimaryGeneratedColumn('uuid')
  id: string;
   
  @Column()
  username: string;
  
  @Column()
  email: string;
  
  @Column()
  password: string;
  
  @Column()
  status: string;
  
  @Column({ default: null, nullable: true })
  otp: string | null;

  
  @Column({ default: null, nullable: true })
  otpExpiration : Date | null;
  
  @OneToOne(() => User, (user) => user.accountId, {
    cascade: true,
  })
  user: User;
  }
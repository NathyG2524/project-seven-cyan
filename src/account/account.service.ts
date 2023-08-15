import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository,  } from 'typeorm';
import { Account } from './entities/account.entity';
import { CollectionQuery, FilterOperators, QueryConstructor } from '../shared/collection-query';
import { CreateAccountDto, UpdateAccountDto, AccountResponseDto } from './dto/account.dto';
import { DataResponseFormat } from '../shared/api-data';
import * as bcrypt from 'bcrypt';
import * as otpGenerator from 'otp-generator';
import { EmailService } from './email.service';
import { CreateUserDto, UserResponseDto } from './dto/user.dto';




@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly repository: Repository<Account>,
    private readonly emailService: EmailService,

      ) {}

async create(account: CreateAccountDto): Promise<AccountResponseDto> {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(account.password, saltRounds);
    const accountEntity = CreateAccountDto.fromDto({ ...account, password: hashedPassword });
    accountEntity.status = 'Draft';	
    await this.repository.save(accountEntity);
    return AccountResponseDto.toDto(accountEntity);
  } catch (error) {
    throw new HttpException(error, HttpStatus.BAD_REQUEST);
  }
}

  async update(id:string, account: UpdateAccountDto): Promise<AccountResponseDto> {
    try{
      account.id = id;
      const accountEntity = UpdateAccountDto.fromDto(account);
      await this.repository.update( {id: account.id}, accountEntity);
      return  AccountResponseDto.toDto(accountEntity );  
    } catch (error) {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
    } 
  }

  async upsert(id:string, user: CreateUserDto): Promise<UserResponseDto> {
    try{
      user.accountId = id;
      const accountEntity = CreateUserDto.fromDto(user);
      await this.repository.upsert(accountEntity , ['accountId']);
      return  UserResponseDto.toDto(accountEntity );  
    } catch (error) {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
    } 
  }

  async findAll(query: CollectionQuery) {

    try {

        // query.filter.push([{ field: 'account', operator: FilterOperators.EqualTo, value: accountId }])
        
        const dataQuery = QueryConstructor.constructQuery<Account>(
          this.repository,
          query
        );
        const response = new DataResponseFormat<Account>();
        if (query.count) {
          response.total = await dataQuery.getCount();
        } else {
          const [result, total] = await dataQuery.getManyAndCount();
          response.total = total;
          response.items = AccountResponseDto.toDtos(result);
        }
        return response;
      } catch (error) {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
    } 
  }

  async findOne(id: string): Promise<AccountResponseDto> {
    try{
      const accountEntity = await this.repository.findOne({ where: { id }});
      return AccountResponseDto.toDto(accountEntity);
    }catch (error) {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
    } 
  }
  async findByEmail(email: string): Promise<AccountResponseDto> {
    try{
      const accountEntity = await this.repository.findOne({ where: { email }});
      return AccountResponseDto.toDto(accountEntity);
    }catch (error) {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
    } 
  }



  async remove(id: string): Promise<void> {
   try{
       await this.repository.delete({ id: id });
    }catch (error) {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
    } 
  }
  
  async generateAndSendOTP(email: string): Promise<void> {
      const user = await this.findByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }
  
      const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false });
  
      // Store the generated OTP in your user entity and update the expiration timestamp
      user.otp = otp;
      user.otpExpiration = new Date(Date.now() + 600000); // OTP expires in 10 minutes
      await this.update(user.id, user);
  
      // Send the OTP via email
      const emailContent = `Your OTP is: ${otp}`;
      this.emailService.sendEmail(email, 'OTP Verification', emailContent);
    }
  
    async verifyOTP(email: string, providedOTP: string): Promise<boolean> {
      const user = await this.repository.findOne({ where: { email }});
      if (!user) {
        throw new Error('User not found');
      }
  
      if (user.otp !== providedOTP || user.otpExpiration <= new Date()) {
        return false; // OTP is invalid or expired
      }
  
      // Mark the OTP as verified and update the user entity
      user.status = 'verified';
      user.otp = null; // Clear the OTP and expiration
      user.otpExpiration = null;
      await this.update(user.id, user);
  
      return true; // OTP verified successfully
    }
}
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString, IsDateString } from 'class-validator';
import { Account } from '../entities/account.entity';
import { User } from '../entities/user.entity';
 

export class CreateAccountDto {
     
  @ApiProperty()
  @IsString()
  username: string;
    
  @ApiProperty()
  @IsString()
  email: string;
    
  @ApiProperty()
  @IsString()
  password: string;
    
  // @ApiProperty()
  // @IsString()
  // status: string;
     
  static fromDto(accountDto:CreateAccountDto): Account {
    const account: Account = new Account();  
 
    account.username=accountDto.username; 
 
    account.email=accountDto.email; 
 
    account.password=accountDto.password; 
 
    return account;
  }
}


export class UpdateAccountDto extends CreateAccountDto {
  @ApiProperty()
  @IsString()
  id: string;

  static fromDto(accountDto:UpdateAccountDto): Account {
    const account: Account = new Account();  
 
    account.id=accountDto.id; 
 
    account.username=accountDto.username; 
 
    account.email=accountDto.email; 
 
    account.password=accountDto.password; 
 
    return account;
  }
}

export class LoginAccountDto  {
  @ApiProperty()
  @IsString()
  email: string;
    
  @ApiProperty()
  @IsString()
  password: string;

  static fromDto(accountDto:LoginAccountDto): Account {
    const account: Account = new Account();  
 
 
    account.email=accountDto.email; 
 
    account.password=accountDto.password; 
 
    return account;
  }
}

export class AccountResponseDto extends UpdateAccountDto {

    
  @IsString()
  status: string;
    
  @IsString()
  otp: string;

  @IsString()
  otpExpiration : Date;

    @IsString()
  createdAt: Date;
    
  @IsString()
  updatedAt: Date;

  user : User;
  static toDto(account:Account): AccountResponseDto {

    const accountDto: AccountResponseDto = new AccountResponseDto();  
 
    accountDto.id=account.id; 
 
    accountDto.username=account.username; 
 
    accountDto.email=account.email; 
 
    accountDto.password=account.password; 
 
    accountDto.status=account.status; 
    return accountDto;
  }

  static toDtos(accounts:Account[]) {
        return accounts.map(account => AccountResponseDto.toDto(account));
    }
}
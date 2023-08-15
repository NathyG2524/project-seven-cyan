import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString, IsDateString } from 'class-validator';
import { User } from '../entities/user.entity';
 

export class CreateUserDto {
     
  @ApiProperty()
  @IsString()
  accountId: string;
    
  @ApiProperty()
  @IsString()
  title: string;
    
  @ApiProperty()
  @IsString()
  bio: string;
    
  @ApiProperty()
  @IsString()
  profilePicture: string;
    
  @ApiProperty()
  @IsString()
  country: string;
    
  @ApiProperty()
  @IsString()
  city: string;
    
  @ApiProperty()
  @IsString()
  phoneNumber: string;
    
  @ApiProperty()
  @IsNumber()
  rank: number;
    
  @ApiProperty()
  @IsNumber()
  score: number;

  @IsString()
  createdAt: Date;
    
  @IsString()
  updatedAt: Date;
     
  static fromDto(userDto:CreateUserDto): User {
    const user: User = new User();  
 
    user.accountId=userDto.accountId; 
 
    user.title=userDto.title; 
 
    user.bio=userDto.bio; 
 
    user.profilePicture=userDto.profilePicture; 
 
    user.country=userDto.country; 
 
    user.city=userDto.city; 
 
    user.phoneNumber=userDto.phoneNumber; 
 
    user.rank=userDto.rank; 
 
    user.score=userDto.score; 
    return user;
  }
}


export class UpdateUserDto extends CreateUserDto {
  @ApiProperty()
  @IsString()
  id: string;

  static fromDto(userDto:UpdateUserDto): User {
    const user: User = new User();  
 
    user.id=userDto.id; 
 
    user.accountId=userDto.accountId; 
 
    user.title=userDto.title; 
 
    user.bio=userDto.bio; 
 
    user.profilePicture=userDto.profilePicture; 
 
    user.country=userDto.country; 
 
    user.city=userDto.city; 
 
    user.phoneNumber=userDto.phoneNumber; 
 
    user.rank=userDto.rank; 
 
    user.score=userDto.score; 
    return user;
  }
}

export class UserResponseDto extends UpdateUserDto {

  static toDto(user:User): UserResponseDto {
    const userDto: UserResponseDto = new UserResponseDto();  
 
    userDto.id=user.id; 
 
    userDto.accountId=user.accountId; 
 
    userDto.title=user.title; 
 
    userDto.bio=user.bio; 
 
    userDto.profilePicture=user.profilePicture; 
 
    userDto.country=user.country; 
 
    userDto.city=user.city; 
 
    userDto.phoneNumber=user.phoneNumber; 
 
    userDto.rank=user.rank; 
 
    userDto.score=user.score; 
    return userDto;
  }

  static toDtos(users:User[]) {
        return users.map(user => UserResponseDto.toDto(user));
    }
}
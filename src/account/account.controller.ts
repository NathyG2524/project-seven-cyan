import { Body, Controller, Delete, Get, Post, Put, Query, Param, Patch, ParseUUIDPipe, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../shared/api-data';
import { CreateAccountDto, UpdateAccountDto, LoginAccountDto } from './dto/account.dto';
import { AccountService } from './account.service';
import { Account } from './entities/account.entity';
import { CollectionQuery, } from '../shared/collection-query';
import { CreateUserDto } from './dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
 

@ApiBearerAuth()
@Controller('accounts')
@ApiTags('accounts')
export class AccountController {

constructor(
  private readonly accountService: AccountService,
  private readonly authService: AuthService
  ) {}

// @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Body() loginAccountDto : LoginAccountDto) : Promise<any>{
    const token = await this.authService.login(loginAccountDto);
  return {
    message: 'Login successful',
    token,
  };
  }

  @Post('refresh-token')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    return await this.authService.refreshToken(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user-info')
  getUserInfo(@Request() req) {
    return req.user
  }

  @Post()
  async create(@Body() createAccountDto: CreateAccountDto) {
    return await this.accountService.create( createAccountDto);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string) {
    return await this.accountService.findOne(id);
  }

  @Get()
  @ApiPaginatedResponse(Account)
  @ApiOkResponse({ type: Account, isArray: false })
  async findAll(@Query() query: CollectionQuery) {
    return await this.accountService.findAll(query);
  }


  @Patch(':id')
  async update(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return await this.accountService.update(id, updateAccountDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.accountService.remove(id);
  }
  
  @Post('send-otp')
  async sendOTP(@Body() { email }: { email: string }) {
    await this.accountService.generateAndSendOTP(email);
    return { message: 'OTP sent successfully' };
  }
  
  @Get('verify-otp')
  async verifyOTP(@Query('email') email: string, @Query('otp') otp: string) {
    const isOTPVerified = await this.accountService.verifyOTP(email, otp);
    if (isOTPVerified) {
      return { message: 'OTP verified successfully' };
    } else {
      return { message: 'OTP verification failed' };
    }
  }

}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { AccountController } from "./account.controller";
import { Account } from "./entities/account.entity";
import { AccountService } from "./account.service";
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { EmailService } from './email.service';


@Module({
  imports: [TypeOrmModule.forFeature([Account]),
  JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '60s' },
  }),
  PassportModule
],
  providers: [AccountService, AuthService, LocalStrategy, JwtStrategy, EmailService],
  controllers: [AccountController],
  exports : [AccountService]
})
export class AccountModule {}
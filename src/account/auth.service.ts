import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccountService } from './account.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
  ) {}

async validateUser(email: string, password: string): Promise<any> {
  const user = await this.accountService.findByEmail(email);
  if (!user) throw new UnauthorizedException('Invalid credentials');
  
  const isPasswordValid = await bcrypt.compareSync(password, user.password);
  if (isPasswordValid) return { id: user.id, email: user.email };
  
  throw new UnauthorizedException('Invalid credentials');
}

  async login(user: any) {
    const account = await this.validateUser(user.email, user.password);
    if (!account) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const accessToken = this.generateAccessToken(user.userName, user.email);
    const refreshToken = this.generateRefreshToken(user.userName, user.email);

    return { accessToken, refreshToken };
  }

  generateAccessToken(userId: string, email: string): string {
    return this.jwtService.sign({ sub: userId, email: email }, { expiresIn: '15m' });
  }

  generateRefreshToken(userId: string, email: string): string {
    return this.jwtService.sign({ sub: userId, email: email }, { expiresIn: '7d' }); // Refresh token expires in 7 days
  }

  refreshToken(refreshToken: string) {
    try {
      const { sub, email } = this.jwtService.verify(refreshToken); // Verify the refresh token
      const accessToken = this.generateAccessToken(sub, email); // Generate a new access token
      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    }
}

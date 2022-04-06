import { AuthDto } from './dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async register(dto: AuthDto) {
    console.log(dto);
    const hash = await bcrypt.hash(dto.password, 12);

    const checkEmail = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (checkEmail) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Email already exists',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.prisma.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        password: hash,
        dateOfBirth: new Date(dto.dateOfBirth),
        gender: dto.gender,
      },
    });
    return user;
  }

  async login(dto: AuthDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'User does not exist',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);

    if (!isMatch) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          message: 'Wrong credentials',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = { email: user.email, sub: user.id };

    await this.prisma.login.create({
      data: {
        userId: user.id,
        browser: dto.browser,
        browserVersion: dto.browserVersion,
        device: dto.device,
        deviceType: dto.deviceType,
        os: dto.os,
        osVersion: dto.osVersion,
        userAgent: dto.userAgent,
      },
    });

    return {
      access_token: this.jwtService.sign({ payload }),
      user: user,
    };
  }
}

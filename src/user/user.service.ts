import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable, Request, HttpException, HttpStatus } from '@nestjs/common';
import { ChangePasswordDto } from './dto/change-password.dto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUser(id: number) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: id,
      },
      include: {
        posts: true,
        likes: true,
        logins: {
          orderBy: {
            id: 'desc',
          },
        },
        passwordChanges: {
          orderBy: {
            id: 'desc',
          },
        },
      },
    });
    return user;
  }

  async changePassword(dto: ChangePasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: dto.userId,
      },
    });

    const hash = user.password;

    const isMatch = await bcrypt.compare(dto.currentPassword, hash);

    if (!isMatch) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          type: 'error',
          message: 'Current Password is incorrect.',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (dto.newPassword == dto.currentPassword) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          type: 'error',
          message: 'New password cannot be the same as the current password.',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    await this.prisma.user.update({
      where: {
        id: dto.userId,
      },
      data: {
        password: await bcrypt.hash(dto.newPassword, 12),
      },
    });

    await this.prisma.passwordChange.create({
      data: {
        userId: dto.userId,
      },
    });

    return {
      type: 'success',
      message: 'Password successfully changed!',
    };
  }

  async clearLogin(loginId) {
    console.log(loginId);

    await this.prisma.login.delete({
      where: {
        id: loginId,
      },
    });

    return {
      type: 'success',
      message: `Successfully removed login ${loginId}`,
    };
  }
}

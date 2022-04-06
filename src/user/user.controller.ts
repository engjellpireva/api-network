import { ChangePasswordDto } from './dto/change-password.dto';
import { GetCurrentUser } from './../auth/utils/get-user-by-id.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getUser(@GetCurrentUser() userId: number) {
    return this.userService.getUser(userId);
  }

  @Post('change-password')
  changePassword(@Body() dto: ChangePasswordDto) {
    return this.userService.changePassword(dto);
  }

  @Post('logins/clear/:id')
  clearLogin(@Param('id') id: string) {
    return this.userService.clearLogin(Number(id));
  }
}

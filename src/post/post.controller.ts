import { LikeDto } from './dto/like.dto';
import { AuthGuard } from '@nestjs/passport';
import { PostDto } from './dto/post.dto';
import { PostService } from './post.service';
import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('new')
  createPost(@Body() dto: PostDto) {
    return this.postService.createPost(dto);
  }

  @Post('new/image')
  @UseInterceptors(FileInterceptor('file'))
  createPostWithImage(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('all')
  getAllPosts() {
    return this.postService.getAllPosts();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('like/:id')
  likePost(@Param('id') id: string, @Body() dto: LikeDto) {
    return this.postService.likePost(Number(id), dto);
  }
}

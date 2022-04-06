import { PrismaService } from './../prisma/prisma.service';
import { PostDto } from './dto/post.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async createPost(dto: PostDto) {
    await this.prisma.post.create({
      data: {
        posterId: dto.posterId,
        description: dto.description,
      },
    });
    return {
      message: 'New post created!',
    };
  }

  async getAllPosts() {
    const posts = await this.prisma.post.findMany({
      orderBy: {
        id: 'desc',
      },
      include: {
        author: true,
        likes: true,
        comments: true,
      },
    });
    return posts;
  }

  async likePost(id, dto) {
    console.log(`Post ${id} user ${dto.userId}`);
    await this.prisma.like.create({
      data: {
        authorId: dto.userId,
        postId: id,
      },
    });
  }

  async createPostWithImage(file) {}
}

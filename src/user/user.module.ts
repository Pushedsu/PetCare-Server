import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './controller/user.controller';
import { User, UserSchema } from './user.schema';
import { UserService } from './service/user.service';
import { UserRepository } from './user.repository';
import { AuthModule } from 'src/auth/auth.module';
import { Posts, PostsSchema } from 'src/posts/posts.schema';
import { AwsService } from 'src/aws/aws.service';
import { MulterModule } from '@nestjs/platform-express/multer';
import { memoryStorage } from 'multer';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MulterModule.register({
      dest: './upload',
      storage: memoryStorage(),
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Posts.name, schema: PostsSchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, AwsService, EmailService],
  exports: [UserService, UserRepository],
})
export class UserModule {}

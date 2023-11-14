import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Document } from 'mongoose';
import { Posts } from 'src/posts/posts.schema';

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class User extends Document {
  @ApiProperty({
    example: 'email@~~.com',
    description: 'User email',
  })
  @Prop({ required: true, unique: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '홍길동',
    description: 'User name',
  })
  @Prop({ required: true, unique: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'password1234',
    description: 'User password',
  })
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  password: string;

  @Prop()
  @IsString()
  refreshToken: string;

  @Prop()
  @IsString()
  image: string;

  readonly readOnlyData: {
    email: string;
    name: string;
    id: string;
    image: string;
    posts: Posts[];
  };

  readonly posts: Posts[];
}

export const _UserSchema = SchemaFactory.createForClass(User);

_UserSchema.virtual('readOnlyData').get(function (this: User) {
  return {
    email: this.email,
    name: this.name,
    id: this.id,
    image: this.image,
    posts: this.posts,
  };
});

_UserSchema.virtual('posts', {
  ref: 'posts',
  localField: '_id',
  foreignField: 'author',
});

_UserSchema.set('toObject', { virtuals: true });
_UserSchema.set('toJSON', { virtuals: true });

export const UserSchema = _UserSchema;

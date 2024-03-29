import { Prop } from '@nestjs/mongoose';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { User } from '../user.schema';

export class UserResponseUserInfo extends PickType(User, [
  'email',
  'name',
  'image',
] as const) {
  @ApiProperty({
    example: '32d804we9t9...',
    description: 'id',
    required: true,
  })
  @Prop()
  @IsString()
  @IsNotEmpty()
  id: string;
}

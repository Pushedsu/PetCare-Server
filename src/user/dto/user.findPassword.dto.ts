import { Prop } from '@nestjs/mongoose';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { User } from '../user.schema';

export class UserFindPasswordDto extends PickType(User, [
  'email',
  'password',
] as const) {
  @ApiProperty({
    example: '32d804we9t9...',
    description: 'id',
    required: true,
  })
  @Prop()
  @IsString()
  @IsNotEmpty()
  id: Types.ObjectId;

  @ApiProperty({
    description: 'password',
    required: true,
  })
  @Prop()
  @IsString()
  @IsNotEmpty()
  currentPassword: string;
}

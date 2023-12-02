import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from '../user.schema';
import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class UserUpdatePasswordDto extends PickType(User, [
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

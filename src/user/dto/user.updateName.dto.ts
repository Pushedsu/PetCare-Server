import { Prop } from '@nestjs/mongoose';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from '../user.schema';
import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class UserUpdateNameDto extends PickType(User, ['name'] as const) {
  @ApiProperty({
    example: '32d804we9t9...',
    description: 'id',
    required: true,
  })
  @Prop()
  @IsString()
  @IsNotEmpty()
  id: Types.ObjectId;
}

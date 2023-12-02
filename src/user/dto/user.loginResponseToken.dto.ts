import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserLoginResponseTokenDto {
  @ApiProperty({
    example: 'eytam142324...',
    description: 'AccessToken',
    required: true,
  })
  @Prop()
  @IsString()
  @IsNotEmpty()
  access_token: string;

  @ApiProperty({
    example: 'eytam14sdr32d4...',
    description: 'RefreshToken',
    required: true,
  })
  @Prop()
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}

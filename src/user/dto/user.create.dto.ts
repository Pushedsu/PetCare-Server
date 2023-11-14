import { PickType } from '@nestjs/swagger';
import { User } from '../user.schema';

export class UserCreateDto extends PickType(User, [
  'email',
  'name',
  'password',
  'refreshToken',
  'image',
] as const) {}

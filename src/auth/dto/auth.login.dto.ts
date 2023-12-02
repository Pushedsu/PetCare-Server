import { PickType } from '@nestjs/swagger';
import { User } from 'src/user/user.schema';

export class AuthLoginDto extends PickType(User, [
  'email',
  'password',
] as const) {}

import { PickType } from '@nestjs/swagger';
import { User } from '../user.schema';

export class UserAccountDeleteDto extends PickType(User, [
  'password',
] as const) {}

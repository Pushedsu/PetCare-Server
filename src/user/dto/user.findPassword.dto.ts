import { PickType } from '@nestjs/swagger';
import { User } from '../user.schema';

export class UserFindPasswordDto extends PickType(User, ['email'] as const) {}

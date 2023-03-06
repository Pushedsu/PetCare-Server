import { PickType } from '@nestjs/swagger';
import { User } from '../user.schema';

export class UserDeleteReqDto extends PickType(User, ['password'] as const) {}

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GooglAuthGuard extends AuthGuard('google') {}

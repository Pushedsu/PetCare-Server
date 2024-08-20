import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID, // CLIENT_ID
      clientSecret: process.env.GOOGLE_SECRET, // CLIENT_SECRET
      callbackURL: 'http://localhost:3000/auth/redirect', // redirect_uri
      passReqToCallback: true,
      accessType: 'offline', // refreshToken
      prompt: 'consent',
      scope: ['email', 'profile'], // 가져올 정보들
    });
  }

  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
      refreshToken,
    };
    done(null, user);
  }
}

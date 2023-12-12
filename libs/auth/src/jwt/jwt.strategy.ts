import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as BaseStrategy, ExtractJwt } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { JwtPayload } from './jwt-payload.interface';
import { AuthService } from '../service/auth.service';
import { User } from 'libs/utils/entities';

@Injectable()
export class JwtStrategy extends PassportStrategy(BaseStrategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${configService.get<string>(
          'AUTH0_DOMAIN',
        )}/.well-known/jwks.json`,
        handleSigningKeyError(err, cb) {
          if (err instanceof Error) {
            console.log('err', err);
            return cb(err);
          }
          return cb(new UnauthorizedException('Signing key error'));
        },
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // audience: configService.get<string>('AUTH0_AUDIENCE'),
      issuer: `https://${configService.get<string>('AUTH0_DOMAIN')}/`,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    // get user info from payload

    const minimumScope = ['openid', 'profile', 'email'];

    if (
      payload?.scope
        ?.split(' ')
        .filter((scope) => minimumScope.indexOf(scope) > -1).length !== 3
    ) {
      throw new UnauthorizedException(
        'JWT does not possess the required scope (`openid profile email`).',
      );
    }

    // console.log('payload', payload);

    const email = payload['https://api.volunteerX.module/email'];

    // console.log('email', email);s

    // ! if error, use an api based on the auth0 user email to get the user info, eg: http://localhost:3510/users?email=${email}

    const user = await this.authService.findUser(email.toString());

    // console.log('payload', user);

    return user;
  }
}

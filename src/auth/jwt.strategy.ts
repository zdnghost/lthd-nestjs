// jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from './constants.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Lấy token từ Header Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // false = tự động check hết hạn
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    // payload là data đã được mã hoá khi sign token (ví dụ: { sub: userId, username: 'test' })
    // return cái gì thì nó sẽ gán vào req.user
    return { userId: payload.sub, username: payload.username };
  }
}

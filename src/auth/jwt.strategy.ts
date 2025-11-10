import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from './constants.js';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Lấy token từ cookie thay vì Authorization header
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.access_token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    // payload là data đã được mã hoá khi sign token
    // return cái gì thì nó sẽ gán vào req.user
    return {
      userId: payload.sub,
      username: payload.username,
      id: payload.sub, // Thêm id để dễ sử dụng
    };
  }
}

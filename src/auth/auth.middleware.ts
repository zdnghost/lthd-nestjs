// src/auth/auth.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: any, res: any, next: () => void) {
    const token = req.cookies?.access_token;

    if (!token) {
      return res.redirect('/login');
    }

    try {
      this.jwtService.verify(token);
      next();
    } catch {
      return res.redirect('/login');
    }
  }
}

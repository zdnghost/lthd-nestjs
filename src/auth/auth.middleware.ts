import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: any, res: any, next: () => void) {
    const token = req.cookies?.access_token;
    
    
    if (!token) {
      console.log('No token, redirecting to /login');
      return res.redirect('/login');
    }

    try {
      const decoded = this.jwtService.verify(token);
      req.user = decoded; // Gán user vào request
      next();
    } catch (error) {
      console.log('Token verification failed:', error.message);
      res.clearCookie('access_token');
      return res.redirect('/login');
    }
  }
}
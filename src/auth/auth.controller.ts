import { Controller, Post, UseGuards, Request, Get, Render } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
    
    constructor(private jwtService: JwtService) { }
    
    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req) {
        const payload = { sub: req.user.id, username: req.user.username };
        const token = this.jwtService.sign(payload);

        // Trả về JSON với access_token
        return {
            access_token: token,
            user: {
                id: req.user.id,
                username: req.user.username
            }
        };
    }
}
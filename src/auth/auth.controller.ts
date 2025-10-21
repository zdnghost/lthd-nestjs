import { Controller, Post, UseGuards, Request, Res,Get,Render } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
    
    constructor(private jwtService: JwtService) { }
    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req, @Res() res) {
        const payload = { sub: req.user.id, username: req.user.username };
        const token = this.jwtService.sign(payload);

        res.cookie('access_token', token, { httpOnly: true });
        return res.redirect('/');
    }
}
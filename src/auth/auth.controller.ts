import { Controller, Post, UseGuards, Request, Res, Get, Render, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service.js';

@Controller('auth')
export class AuthController {
    
    constructor(
        private jwtService: JwtService,
        private usersService: UsersService,
    ) { }
    
    @Post('register')
    async register(@Body() body: any, @Res() res) {
        try {
            // Kiểm tra xem username đã tồn tại chưa
            const existingUser = await this.usersService.findUser(body.username);
            if (existingUser) {
                return res.render('register', {
                    layout: 'layouts/auth',
                    title: 'Đăng ký',
                    error: 'Tài khoản đã tồn tại.',
                    username: body.username
                });
            }

            // Tạo user mới
            const newUser = await this.usersService.create({
                username: body.username,
                password: body.password,
                firstName: body.firstName || '',
                lastName: body.lastName || '',
                age: body.age ? parseInt(body.age, 10) : 0,
            });

            // Tự động đăng nhập sau khi đăng ký thành công
            const payload = { sub: newUser.id, username: newUser.username };
            const token = this.jwtService.sign(payload);
            
            res.cookie('access_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // true khi production
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000 // 1 ngày
            });

            // Redirect về trang chủ sau khi đăng ký thành công
            return res.redirect('/');
        } catch (error) {
            console.error("Registration error:", error);
            return res.render('register', {
                layout: 'layouts/auth',
                title: 'Đăng ký',
                error: 'Đã có lỗi xảy ra trong quá trình đăng ký.',
                username: body.username
            });
        }
    }

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req, @Res() res) {
        const payload = { sub: req.user.id, username: req.user.username };
        const token = this.jwtService.sign(payload);
        
        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // true khi production
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 1 ngày
        });
        
        return res.redirect('/');
    }

    @Post('logout')
    async logout(@Res() res) {
        res.clearCookie('access_token');
        return res.redirect('/login');
    }
}
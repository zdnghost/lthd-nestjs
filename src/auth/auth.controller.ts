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
            // Kiểm tra xem username đã tồn tại chưa (tùy chọn)
            const existingUser = await this.usersService.findUser(body.username);
            if (existingUser) {
                // Xử lý lỗi username đã tồn tại, ví dụ render lại form với thông báo lỗi
                 return res.render('register', {
                   layout: 'layouts/auth',
                   title: 'Đăng ký',
                   error: 'Tài khoản đã tồn tại.',
                   username: body.username // Giữ lại username đã nhập
                 });
            }

            // Tạo user mới
            await this.usersService.create({
                username: body.username,
                password: body.password,
                // Thêm các trường khác nếu cần (firstName, lastName, age...)
                firstName: body.firstName || '',
                lastName: body.lastName || '',
                age: body.age ? parseInt(body.age, 10) : 0,
            });

            // Chuyển hướng đến trang đăng nhập sau khi đăng ký thành công
            return res.redirect('/login');
        } catch (error) {
            console.error("Registration error:", error);
             // Xử lý lỗi chung, ví dụ render lại form với thông báo lỗi chung
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
<<<<<<< Updated upstream
    async login(@Request() req, @Res() res) {
      const payload = { sub: req.user.id, username: req.user.username };
      const token = this.jwtService.sign(payload);
    
      res.cookie('access_token', token, {
        httpOnly: true,
        secure: false, // production thì bật true (HTTPS)
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
      });
    
      return res.redirect('/');
=======
    async login(@Request() req) {
        const payload = { sub: req.user.id, username: req.user.username };
        const token = this.jwtService.sign(payload);

        
        return {
            access_token: token,
            user: {
                id: req.user.id,
                username: req.user.username
            }
        };
>>>>>>> Stashed changes
    }
    
}
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator.js';
import { UserRole } from '../entities/User.entity.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Lấy các roles được yêu cầu từ decorator @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [
        context.getHandler(), // Lấy từ method
        context.getClass(), // Lấy từ class
      ],
    );

    // Nếu không có roles yêu cầu, cho phép truy cập
    if (!requiredRoles) {
      return true;
    }

    // Lấy user từ request (đã được gán bởi JWT Strategy)
    const { user } = context.switchToHttp().getRequest();

    // Kiểm tra user có tồn tại không
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Kiểm tra role của user có nằm trong danh sách roles yêu cầu không
    const hasRole = requiredRoles.some((role) => user.role === role);

    if (!hasRole) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }
}

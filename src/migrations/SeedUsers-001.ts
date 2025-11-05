import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/entities/User.entity.js';

// Khai báo một mảng các user mẫu
const usersToSeed = [
  {
    username: 'admin',
    firstName: 'Super',
    lastName: 'Admin',
    role: UserRole.ADMIN,
    password: 'admin123',
  },
  {
    username: 'testuser1',
    firstName: 'Test',
    lastName: 'One',
    role: UserRole.USER,
    password: 'password',
  },
  {
    username: 'testuser2',
    firstName: 'Test',
    lastName: 'Two',
    role: UserRole.USER,
    password: 'password',
  },
  {
    username: 'testuser3',
    firstName: 'Test',
    lastName: 'Three',
    role: UserRole.USER,
    password: 'password',
  },
  {
    username: 'testuser4',
    firstName: 'Test',
    lastName: 'Four',
    role: UserRole.USER,
    password: 'password',
  },
  {
    username: 'testuser5',
    firstName: 'Test',
    lastName: 'Five',
    role: UserRole.USER,
    password: 'password',
  },
  {
    username: 'testuser6',
    firstName: 'Test',
    lastName: 'Six',
    role: UserRole.USER,
    password: 'password',
  },
  {
    username: 'testuser7',
    firstName: 'Test',
    lastName: 'Seven',
    role: UserRole.USER,
    password: 'password',
  },
  {
    username: 'testuser8',
    firstName: 'Test',
    lastName: 'Eight',
    role: UserRole.USER,
    password: 'password',
  },
  {
    username: 'testuser9',
    firstName: 'Test',
    lastName: 'Nine',
    role: UserRole.USER,
    password: 'password',
  },
];

export class SeedUsersXXX implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const saltRounds = 10;

    console.log(`Bắt đầu seeding ${usersToSeed.length} Users...`);

    for (const user of usersToSeed) {
      // Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);

      // Chèn dữ liệu vào bảng user
      await queryRunner.query(
        `INSERT INTO "user" ("firstName", "lastName", "username", "password", "role", "isActive", "createdAt", "updatedAt") 
                 VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
        [
          user.firstName,
          user.lastName,
          user.username,
          hashedPassword,
          user.role,
          true, // isActive
        ],
      );
    }

    console.log('Seeding Users hoàn tất.');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Lệnh 'down' để xóa dữ liệu mẫu khi rollback migration
    const usernames = usersToSeed.map((u) => `'${u.username}'`).join(',');
    await queryRunner.query(
      `DELETE FROM "user" WHERE "username" IN (${usernames})`,
    );

    console.log('Xóa Users mẫu hoàn tất.');
  }
}

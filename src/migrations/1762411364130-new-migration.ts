import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigration1762411364130 implements MigrationInterface {
  name = 'NewMigration1762411364130';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`offer_history\` (\`id\` varchar(36) NOT NULL, \`price\` decimal(12,2) NOT NULL, \`promotionPrice\` decimal(12,2) NOT NULL, \`currency\` varchar(10) NOT NULL DEFAULT 'USD', \`recordedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`offerId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`offers\` (\`id\` varchar(36) NOT NULL, \`shoppingPlatform\` varchar(100) NULL, \`sellerName\` varchar(150) NOT NULL, \`price\` decimal(12,2) NOT NULL, \`promotionsPrice\` decimal(12,2) NULL, \`currency\` varchar(10) NOT NULL DEFAULT 'USD', \`url\` varchar(1000) NULL, \`stock\` int NULL, \`platform\` varchar(50) NULL, \`gameId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`game\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` text NULL, \`platforms\` text NULL, \`type\` varchar(50) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`age\` int NULL, \`role\` enum ('admin', 'user') NOT NULL DEFAULT 'user', \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_game\` (\`user_id\` varchar(36) NOT NULL, \`game_id\` varchar(36) NOT NULL, INDEX \`IDX_7381ad962b894547e0a5ccb41d\` (\`user_id\`), INDEX \`IDX_12f188489969f75bf48f717274\` (\`game_id\`), PRIMARY KEY (\`user_id\`, \`game_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`offer_history\` ADD CONSTRAINT \`FK_ba85ecc7789218b80c3c3925473\` FOREIGN KEY (\`offerId\`) REFERENCES \`offers\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`offers\` ADD CONSTRAINT \`FK_f7d9e6404de205f94ba03d8e18e\` FOREIGN KEY (\`gameId\`) REFERENCES \`game\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_game\` ADD CONSTRAINT \`FK_7381ad962b894547e0a5ccb41df\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_game\` ADD CONSTRAINT \`FK_12f188489969f75bf48f7172741\` FOREIGN KEY (\`game_id\`) REFERENCES \`game\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_game\` DROP FOREIGN KEY \`FK_12f188489969f75bf48f7172741\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_game\` DROP FOREIGN KEY \`FK_7381ad962b894547e0a5ccb41df\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`offers\` DROP FOREIGN KEY \`FK_f7d9e6404de205f94ba03d8e18e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`offer_history\` DROP FOREIGN KEY \`FK_ba85ecc7789218b80c3c3925473\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_12f188489969f75bf48f717274\` ON \`user_game\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_7381ad962b894547e0a5ccb41d\` ON \`user_game\``,
    );
    await queryRunner.query(`DROP TABLE \`user_game\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` ON \`user\``,
    );
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(`DROP TABLE \`game\``);
    await queryRunner.query(`DROP TABLE \`offers\``);
    await queryRunner.query(`DROP TABLE \`offer_history\``);
  }
}

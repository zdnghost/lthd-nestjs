import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigration1759472781358 implements MigrationInterface {
  name = 'NewMigration1759472781358';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`game\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` text NULL, \`platforms\` text NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`offers\` (\`id\` varchar(36) NOT NULL, \`sellerName\` varchar(150) NOT NULL, \`price\` decimal(12,2) NOT NULL, \`currency\` varchar(10) NOT NULL DEFAULT 'USD', \`url\` varchar(1000) NULL, \`stock\` int NULL, \`platform\` varchar(50) NULL, \`gameId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`offers\` ADD CONSTRAINT \`FK_f7d9e6404de205f94ba03d8e18e\` FOREIGN KEY (\`gameId\`) REFERENCES \`game\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`offers\` DROP FOREIGN KEY \`FK_f7d9e6404de205f94ba03d8e18e\``,
    );
    await queryRunner.query(`DROP TABLE \`offers\``);
    await queryRunner.query(`DROP TABLE \`game\``);
  }
}

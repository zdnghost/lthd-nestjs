import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn} from "typeorm";

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user'
}

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    age: number;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER
    })
    role: UserRole;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert } from 'typeorm';
import { Review } from './review.entity';
import bcrypt from 'bcryptjs';

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        unique: true,
        nullable: false
    })
    email: string;

    @Column()
    password: string;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 12);
    }

    static async comparePasswords(
        candidatePassword: string,
        hashedPassword: string
    ) {
        return await bcrypt.compare(candidatePassword, hashedPassword);
    }

    @Column()
    createdAt: Date;

    toJSON() {
        return { ...this, password: undefined };
    }
    @OneToMany(() => Review, review => review.user)
    reviews: Review[];
}

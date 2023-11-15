import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { User } from './user.entity';

export enum ReviewStatus {
    DRAFT = 'черновик',
    PUBLISHED = 'опубликован',
}

@Entity('review')
export class Review {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false
    })
    userId: number;

    @Column({
        nullable: false
    })
    text: string;

    @Column({
        nullable: false
    })
    name: string;

    @Column({
        nullable: false
    })
    status: ReviewStatus;

    @Column({
        default: false
    })
    isDeleted: boolean;

    @Column()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
    @ManyToOne(() => User, user => user.reviews)
    user: User;
}
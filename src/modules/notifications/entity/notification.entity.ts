import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { User } from '../../users/entity/user.entity';
  import { Song } from '../../songs/entity/song.entity';
  
  @Entity({ name: 'notifications' })
  export class Notification {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ length: 255 })
    message: string;
  
    // Liên kết đến người nhận (User)
    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'recipientId' })
    recipient: User;
  
    @Column()
    recipientId: number;
  
    // Liên kết đến bài hát nếu có
    @ManyToOne(() => Song, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'songId' })
    song?: Song;
  
    @Column({ nullable: true })
    songId?: number;
  
    @Column({ default: false })
    isRead: boolean;
  
    @CreateDateColumn()
    createdAt: Date;
  }
  
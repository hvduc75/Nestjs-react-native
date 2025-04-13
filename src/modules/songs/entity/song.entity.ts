import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SongStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  CANCEL = 'cancel',
}

@Entity({ name: 'songs' }) // Định nghĩa entity, ánh xạ với bảng `songs`
export class Song {
  @PrimaryGeneratedColumn() // Tự động tăng ID
  id: number;

  @Column({ length: 100 }) // Tên bài hát, max 100 ký tự
  name: string;

  @Column({ nullable: true })
  artist: string;

  @Column({ nullable: true })
  imageUrl?: string; // URL ảnh bìa từ Cloudinary

  @Column({ nullable: true })
  songUrl?: string; // URL file nhạc từ Cloudinary

  @Column({ default: 0 })
  play_count: number;

  @Column({
    type: 'enum',
    enum: SongStatus,
    default: SongStatus.PENDING, // Mặc định là 'pending'
  })
  status: SongStatus;

  @CreateDateColumn() // Ngày tạo
  createdAt: Date;

  @UpdateDateColumn() // Ngày cập nhật gần nhất
  updatedAt: Date;
}

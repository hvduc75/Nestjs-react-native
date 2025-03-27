import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'songs' }) // Định nghĩa entity, ánh xạ với bảng `songs`
export class Song {
  @PrimaryGeneratedColumn() // Tự động tăng ID
  id: number;

  @Column({ length: 100 }) // Tên bài hát, max 100 ký tự
  name: string;

  @Column()
  artist: string;

  @Column({ nullable: true })
  imageUrl?: string; // URL ảnh bìa từ Cloudinary

  @Column({ nullable: true })
  songUrl?: string; // URL file nhạc từ Cloudinary

  @Column({ default: 0 })
  play_count: number;

  @CreateDateColumn() // Ngày tạo
  createdAt: Date;

  @UpdateDateColumn() // Ngày cập nhật gần nhất
  updatedAt: Date;
}

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'users' }) // Định nghĩa entity, ánh xạ với bảng `users`
export class User {
  @PrimaryGeneratedColumn() // Tự động tăng ID
  id: number;

  @Column({ length: 100 }) // Tên user, max 100 ký tự
  name: string;

  @Column({ unique: true }) // Email, không được trùng
  email: string;

  @Column() // Mật khẩu
  password: string;
  
  @Column({ default: 'User' }) // Quyền hạn, mặc định là 'user'
  role: string; // Quyền hạn, mặc định là 'user'

  @CreateDateColumn() // Ngày tạo
  createdAt: Date;

  @UpdateDateColumn() // Ngày cập nhật gần nhất
  updatedAt: Date;
}

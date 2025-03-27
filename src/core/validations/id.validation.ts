import { z } from 'zod';

export const idSchema = z
  .string()
  .regex(/^\d+$/, { message: 'Invalid ID, must be a number' }) // Chỉ chấp nhận số nguyên dương
  .transform(Number) // Chuyển chuỗi thành số
  .refine((val) => Number.isInteger(val) && val > 0, {
    message: 'ID must be a positive integer',
  });

import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const paginationSchema = z.object({
  offset: z.string().optional(),
  limit: z.string().optional(),
  q: z.string().optional(),
});

export class PaginationDto extends createZodDto(paginationSchema) {}

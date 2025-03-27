import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateSongSchema = z.object({
  name: z.string().nonempty({ message: 'Name is required' }),
  artist: z.string().nonempty({ message: 'Artist is required' }),
  imageUrl: z.string().optional(),
  songUrl: z.string().optional(),
});

export class CreateSongDto extends createZodDto(CreateSongSchema) {}
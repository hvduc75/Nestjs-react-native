import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateAuthSchema = z.object({
    name: z.string().nonempty({ message: 'Name is required' }),
    email: z.string().email({ message: 'Invalid email' }),
    password: z.string().nonempty({ message: 'Password is required' }),
  });
  
  export class CreateAuthDto extends createZodDto(CreateAuthSchema) {}

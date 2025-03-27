// import { IsEmail, IsNotEmpty } from "class-validator";

// export class CreateUserDto {
//     @IsNotEmpty({message: 'Name is required'})
//     name: string;

//     @IsEmail({}, {message: 'Invalid email'})
//     email: string;

//     @IsNotEmpty({message: 'Password is required'})
//     password: string;
// }

import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateUserSchema = z.object({
  name: z.string().nonempty({ message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().nonempty({ message: 'Password is required' }),
});

export class CreateUserDto extends createZodDto(CreateUserSchema) {}

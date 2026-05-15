import { z } from 'zod';

export const formSchema = z.object({
    name: z.string().min(1, 'First name is required').max(50),
    lastName: z.string().min(1, 'Last name is required').max(50),
    email: z.string().email('Invalid email address'),
    phoneCode: z.string().default('+420'),
    phone: z.string().optional().default(''),
    birthDate: z.date().optional(),
    country: z.string().optional().default(''),
    city: z.string().min(1, 'City is required'),
    street: z.string().min(1, 'Street is required'),
    number: z.string().min(1, 'Number is required'),
    zip: z.string().min(3, 'ZIP code is required'),
});

export type FormSchema = typeof formSchema;
import { z } from "zod";

export const UserSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Name is required'),
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().regex( /^(\+?\d{1,2}\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/, "Invalid phone number"),
  website: z.string()
    // .regex( /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/,"Invalid URL format")
      .optional(),
  address: z.object({
    suite: z.string().optional(),
    street: z.string().optional(),
    city: z.string().optional(),
    zipcode: z.string().optional(),
    geo: z.object({
      lat: z.string().optional(),
      lang: z.string().optional()
    }).optional()
  }).optional(),
  company: z.object({
    name: z.string().optional(),
    catchPhrase: z.string().optional(),
    bs: z.string()
  }).optional()
  
});

export type User = z.infer<typeof UserSchema>;

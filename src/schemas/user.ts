import { z } from "zod";

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  email: z.string().email(),
  phone: z.string().email().optional(),
  website: z.string().email().optional(),
  address: z.object({
    street: z.string().optional(),
    suite: z.string().optional(),
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

import * as z from "zod";

export const profileFormSchema = z.object({
  idNumber: z.string().min(1, "ID number is required"),
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phoneNumber: z.string().optional(),
});

export type ProfileFormSchema = z.infer<typeof profileFormSchema>;

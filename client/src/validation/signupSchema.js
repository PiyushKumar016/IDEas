import { z } from "zod";

const SignupSchema = z
  .object({
    username: z
      .string({ required_error: "Username is required" })
      .min(3, "Username must be at least 3 characters long")
      .trim(),

    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email address")
      .endsWith(".com", "Email must end with .com"),

    password: z
      .string({ required_error: "Password is required" })
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),

    confirm_password: z
      .string({ required_error: "Confirm password is required" }),
  })
  .refine((data) => data.confirm_password === data.password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export default SignupSchema;
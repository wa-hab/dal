import { z } from "zod";

export const transactionSchema = z.object({
  amount: z
    .number()
    .nonnegative()
    .refine((val) => val > 0, {
      message: "Amount must be greater than 0",
    }),
  type: z.enum(["credit", "debit"]),
});

export const createTransactionSchema = z.object({
  body: transactionSchema,
});

export const getTransactionByIdSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => parseInt(val)),
  }),
});

export type CreateTransactionSchema = z.infer<typeof createTransactionSchema>;
export type GetTransactionByIdSchema = z.infer<typeof getTransactionByIdSchema>;

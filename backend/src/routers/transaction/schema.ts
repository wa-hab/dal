import { z } from "zod";

export const transactionSchema = z.object({
  amount: z.string(),
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

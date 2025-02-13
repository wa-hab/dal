import { db } from "@/lib/db";
import { transactions } from "@/lib/db/schema";
import { InferInsertModel, desc, eq } from "drizzle-orm";

export const createTransaction = async (
  data: InferInsertModel<typeof transactions>,
) => {
  return await db.insert(transactions).values(data).returning();
};

export const getTransactions = async () => {
  return await db
    .select()
    .from(transactions)
    .orderBy(desc(transactions.timestamp));
};

export const getTransactionById = async (id: number) => {
  return await db.select().from(transactions).where(eq(transactions.id, id));
};

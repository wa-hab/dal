import {
  pgTable,
  integer,
  decimal,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

export const transactions = pgTable("transactions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  type: varchar("type", { length: 6 }).notNull().$type<"credit" | "debit">(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

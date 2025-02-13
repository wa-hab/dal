export type Transaction = {
  id: string;
  amount: number;
  type: "credit" | "debit";
  timestamp: string;
};

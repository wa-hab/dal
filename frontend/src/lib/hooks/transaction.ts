import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type Transaction = {
  id: string;
  amount: string;
  type: "credit" | "debit";
  timestamp: string;
};

const transactionApi = {
  getAll: () => axios.get<{ data: Transaction[] }>("/transactions"),
  getById: (id: string) =>
    axios.get<{ data: Transaction }>(`/transactions/${id}`),
  create: (data: Pick<Transaction, "amount" | "type">) =>
    axios.post("/transactions", data),
};

export const queryConfigTransactions = {
  queryKey: ["transactions"],
  queryFn: () => transactionApi.getAll().then((res) => res.data.data),
};

export const useTransactions = () => {
  return useQuery<Transaction[]>(queryConfigTransactions);
};

export const useTransaction = (id: string) => {
  return useQuery<Transaction>({
    queryKey: ["transactions", id],
    queryFn: () => transactionApi.getById(id).then((res) => res.data.data),
  });
};

export const useCreateTransaction = () => {
  const utils = useQueryClient();

  return useMutation({
    mutationFn: transactionApi.create,
    onSuccess: () => {
      utils.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};

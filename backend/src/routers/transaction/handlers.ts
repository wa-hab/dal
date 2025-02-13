import type { Response } from "express";
import { RequestHandler } from "express";
import { TypedRequest } from "@/lib/types";
import { sendResponse, sendGenericErrorResponse } from "@/lib/utils";
import {
  createTransaction,
  getTransactions,
  getTransactionById,
} from "@/repository/transaction";
import { CreateTransactionSchema, GetTransactionByIdSchema } from "./schema";

export const createTransactionHandler = async (
  req: TypedRequest<CreateTransactionSchema>,
  res: Response,
) => {
  try {
    const { amount, type, timestamp = new Date() } = req.body;

    const [transaction] = await createTransaction({ amount, type, timestamp });

    return sendResponse(res, transaction);
  } catch (err) {
    console.error("Error creating transaction:", err);
    return sendGenericErrorResponse(res);
  }
};

export const getTransactionsHandler = async (
  req: TypedRequest<unknown>,
  res: Response,
) => {
  try {
    const transactions = await getTransactions();
    return sendResponse(res, transactions);
  } catch (err) {
    console.error("Error getting transactions:", err);
    return sendGenericErrorResponse(res);
  }
};

export const getTransactionByIdHandler = async (
  req: TypedRequest<GetTransactionByIdSchema>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const [transaction] = await getTransactionById(id);

    if (!transaction) {
      return sendGenericErrorResponse(res, "Transaction not found");
    }

    return sendResponse(res, transaction);
  } catch (err) {
    console.error("Error getting transaction by id:", err);
    return sendGenericErrorResponse(res);
  }
};

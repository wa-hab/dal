import { Router } from "express";
import {
  getTransactionsHandler,
  createTransactionHandler,
  getTransactionByIdHandler,
} from "./handlers";
import { validateRequest } from "@/lib/utils";
import { createTransactionSchema, getTransactionByIdSchema } from "./schema";

const transactionRouter = Router();

transactionRouter.get("/", getTransactionsHandler);
transactionRouter.post(
  "/",
  validateRequest(createTransactionSchema),
  createTransactionHandler,
);
transactionRouter.get(
  "/:id",
  validateRequest(getTransactionByIdSchema),
  getTransactionByIdHandler,
);

export default transactionRouter;

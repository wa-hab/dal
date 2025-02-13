import express from "express";
import cors from "cors";
import transactionRouter from "@/routers/transaction";

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

app.use("/transactions", transactionRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

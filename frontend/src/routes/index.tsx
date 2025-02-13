import BarLoader from "@/components/loader";
import { useCreateTransaction, useTransactions } from "@/lib/hooks/transaction";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/lib/hooks/transaction";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { Plus, Minus, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  type: z.enum(["credit", "debit"]),
});

function TransactionCard({ tx }: { tx: Transaction }) {
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  return (
    <div
      key={tx.id}
      className="p-4 md:p-6 border border-gray-200 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center hover:border-blue-200 hover:bg-blue-50 transition-all duration-200 bg-white shadow-sm hover:shadow space-y-4 md:space-y-0"
    >
      <div className="flex items-center space-x-4">
        <div
          className={`p-2 md:p-3 rounded-full ${tx.type === "credit" ? "bg-green-100" : "bg-red-100"}`}
        >
          {tx.type === "credit" ? (
            <Plus className="w-4 h-4 md:w-6 md:h-6 text-green-600" />
          ) : (
            <Minus className="w-4 h-4 md:w-6 md:h-6 text-red-600" />
          )}
        </div>
        <span
          className={`text-base md:text-lg ${
            tx.type === "credit"
              ? "text-green-600 font-semibold"
              : "text-red-600 font-semibold"
          }`}
        >
          {tx.type === "credit" ? "+" : "-"}${tx.amount}
        </span>
      </div>
      <div className="flex flex-col items-start md:items-end w-full md:w-auto">
        <div className="text-sm font-medium text-gray-900">
          {formatDate(tx.timestamp)}
        </div>
        <div className="text-xs text-gray-500">{formatTime(tx.timestamp)}</div>
      </div>
    </div>
  );
}

function AddTransactionDialog() {
  const { mutate, isPending } = useCreateTransaction();
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      type: "credit",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full md:w-auto">Add Transaction</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <div className="grid grid-cols-2 gap-4">
                        <div
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            field.value === "credit"
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200 hover:border-green-200"
                          }`}
                          onClick={() => field.onChange("credit")}
                        >
                          <div className="flex items-center justify-center mb-2">
                            <Plus className="w-6 h-6 text-green-600" />
                          </div>
                          <div className="text-center font-medium">Credit</div>
                        </div>
                        <div
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            field.value === "debit"
                              ? "border-red-500 bg-red-50"
                              : "border-gray-200 hover:border-red-200"
                          }`}
                          onClick={() => field.onChange("debit")}
                        >
                          <div className="flex items-center justify-center mb-2">
                            <Minus className="w-6 h-6 text-red-600" />
                          </div>
                          <div className="text-center font-medium">Debit</div>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <BarLoader></BarLoader>
                      Adding...
                    </div>
                  ) : (
                    "Add Transaction"
                  )}
                </Button>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export const Route = createFileRoute("/")({
  component: TransactionList,
});

function TransactionList() {
  const queryClient = useQueryClient();
  const { data, isPending, isLoading } = useTransactions();

  if (isLoading) {
    return (
      <div className="h-screen w-screen">
        <div className="max-w-4xl mx-auto p-4 md:p-8 h-full">
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-8 h-full flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 p-4 md:p-6 rounded-lg shadow-sm space-y-4 md:space-y-0">
              <div>
                <Skeleton className="h-8 w-48 mb-4" />
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-stretch md:items-center space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-6 border border-gray-200 rounded-xl flex justify-between items-center"
                >
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalCredited =
    data?.reduce(
      (acc, tx) => (tx.type === "credit" ? acc + Number(tx.amount) : acc),
      0,
    ) || 0;
  const totalDebited =
    data?.reduce(
      (acc, tx) => (tx.type === "debit" ? acc + Number(tx.amount) : acc),
      0,
    ) || 0;

  return (
    <div className="h-screen w-screen">
      <div className="max-w-4xl mx-auto p-4 md:p-8 h-full">
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-8 h-full flex flex-col">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 p-4 md:p-6 rounded-lg shadow-sm space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">
                Transactions
              </h1>
              <div className="flex gap-4">
                <div className="text-green-600">
                  Total Credited: ${totalCredited.toFixed(2)}
                </div>
                <div className="text-red-600">
                  Total Debited: ${totalDebited.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-stretch md:items-center space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
              <AddTransactionDialog />

              <Button
                onClick={() => {
                  queryClient.resetQueries({
                    queryKey: ["transactions"],
                  });
                }}
                disabled={isPending}
                className="flex items-center justify-center bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm transition-all duration-200 w-full md:w-auto"
              >
                <RefreshCw
                  className={cn("w-4 h-4 mr-2", {
                    "animate-spin": isPending,
                  })}
                />
                Refresh
              </Button>
            </div>
          </div>

          <div className="space-y-4 flex-1 overflow-auto">
            {data?.length === 0 ? (
              <div className="text-center py-8 md:py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <div className="text-gray-400 text-5xl md:text-7xl mb-4 md:mb-6 animate-bounce">
                  💸
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 md:mb-3">
                  No Transactions Found
                </h3>
                <p className="text-sm md:text-base text-gray-600 max-w-sm mx-auto px-4">
                  Create your first transaction to start tracking your financial
                  activity
                </p>
              </div>
            ) : (
              data?.map((tx) => <TransactionCard key={tx.id} tx={tx} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionList;

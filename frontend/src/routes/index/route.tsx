import { useTransactions } from "@/lib/hooks/transaction";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { AddTransactionDialog } from "./-add-transaction-dialog";
import { TransactionCard } from "./-transaction-card";

export const Route = createFileRoute("/")({
  component: TransactionList,
});

function LoadingSkeleton() {
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

function EmptyState() {
  return (
    <div className="text-center py-8 md:py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
      <div className="text-gray-400 text-5xl md:text-7xl mb-4 md:mb-6 animate-bounce">
        💸
      </div>
      <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 md:mb-3">
        No Transactions Found
      </h3>
      <p className="text-sm md:text-base text-gray-600 max-w-sm mx-auto px-4">
        Create your first transaction to start tracking your financial activity
      </p>
    </div>
  );
}
function TransactionList() {
  const queryClient = useQueryClient();
  const { data, isPending, isLoading } = useTransactions();

  if (isLoading) {
    return <LoadingSkeleton />;
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
              <EmptyState />
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

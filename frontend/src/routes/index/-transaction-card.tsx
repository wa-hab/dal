import { Plus, Minus } from "lucide-react";
import type { Transaction } from "@/lib/types";

export function TransactionCard({ tx }: { tx: Transaction }) {
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

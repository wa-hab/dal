import BarLoader from "@/components/loader";
import { useCreateTransaction } from "@/lib/hooks/transaction";
import { Plus, Minus, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";

const formSchema = z.object({
  amount: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => val > 0, {
      message: "Amount must be greater than 0",
    }),
  type: z.enum(["credit", "debit"]),
});

export function AddTransactionDialog() {
  const { mutate, isPending } = useCreateTransaction();
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
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
                        <Input type="string" {...field} />
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

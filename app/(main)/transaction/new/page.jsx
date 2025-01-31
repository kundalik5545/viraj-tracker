"use client";
import { createTransaction } from "@/actions/transaction";
import { AuthGuard } from "@/components/auth-guard";
import useFetch from "@/hooks/use-Fetch";
import { addTransactionSchema } from "@/lib/Schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ArrowRightLeft, CalendarIcon, Heading1 } from "lucide-react";
import { transactionCategories3 } from "@/data/Categories";
import { getDefaultBankAccountWithBalance } from "@/actions/bankAccount";

const AddTransactionPage = () => {
  const [bankAccount, setBankAccount] = useState({
    defaultBankAcc: null,
    otherAccounts: [],
  });

  const navigation = useRouter();
  const transactionTypes = ["INCOME", "EXPENSE", "INVESTMENT", "TRANSFER"];
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm({
    resolver: zodResolver(addTransactionSchema),
    defaultValues: {
      type: "",
      category: "",
      subCategory: "",
      amount: "",
      date: "",
      description: "",
      status: "",
      bankAccountId: "",
      transferAccountId: "",
    },
  });
  const type = watch("type");
  const category = watch("category");
  const date = watch("date");
  const subCategory = watch("subCategory");
  const bankAccountId = watch("bankAccountId");

  // Fetch bank accounts
  const {
    apiFun: addTransFn,
    apiRes: addTransRes,
    loading: addTransLoading,
    error,
  } = useFetch(createTransaction);

  const onSubmit = async (data) => {
    await addTransFn(data);
  };

  console.log("Api res:- ", addTransRes);
  console.log("Api error:- ", error);

  const handleCancel = () => {
    reset();
    navigation.back();
  };

  const filteredCategories = transactionCategories3.filter(
    (category) => category.type.toLowerCase() === type?.toLowerCase()
  );

  const filteredSubCategories =
    type === "EXPENSE"
      ? transactionCategories3
          .filter(
            (item) => item.category.toLowerCase() === category?.toLowerCase()
          )
          .flatMap((item) => item.subcategories || [])
      : [];

  // Fetch default bank account and other accounts
  const {
    apiFun: getBankAccFn,
    apiRes: getBankAccRes,
    loading: getBankAccLoading,
    error: getBankAccError,
  } = useFetch(getDefaultBankAccountWithBalance);

  useEffect(() => {
    getBankAccFn();
  }, []);

  useEffect(() => {
    if (getBankAccRes && !getBankAccLoading) {
      setBankAccount(getBankAccRes);
    }
  }, [getBankAccRes]);

  return (
    <AuthGuard>
      <div className="container mx-auto p-2 pt-4 md:pt-0 md:p-6 ">
        <Card className="max-w-2xl mx-auto md:my-10">
          <CardHeader>
            <CardTitle className="text-3xl gradient-subTitle flex text-center space-x-3">
              Add New Transaction
            </CardTitle>
            <CardDescription>
              ✅ Enter the details of your transaction below👇
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="bank-account">
                <Label htmlFor="bankAccountId">Select Bank Account</Label>
                <Select
                  onValueChange={(value) => setValue("bankAccountId", value)}
                  value={watch("bankAccountId")}
                  name="bankAccountId"
                  id="bankAccountId"
                  className="w-full"
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        bankAccount?.defaultAccount
                          ? `${bankAccount.defaultAccount.bankName} 👉 ${bankAccount.defaultAccount.openingBalance}`
                          : "Select Bank"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {bankAccount?.otherAccounts?.map((account) => (
                      <SelectItem
                        key={account.id}
                        value={account.id}
                        className="flex justify-between items-center px-4 py-2"
                      >
                        <span className="text-left">
                          {account.bankName.charAt(0).toUpperCase() +
                            account.bankName.slice(1).toLowerCase()}
                        </span>
                        {" 👉"}
                        <span className="bg-pink-100 px-3 py-1 rounded-full text-sm font-medium">
                          {account.openingBalance}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.bankAccountId && (
                  <p className="text-red-500">{errors.bankAccountId.message}</p>
                )}
              </div>

              {/* type */}
              <div className="type">
                <Label htmlFor="type">Transaction Type</Label>
                <Select
                  onValueChange={(value) => setValue("type", value)}
                  name="type"
                  id="type"
                  className="w-full"
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {transactionTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() +
                          type.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-red-500">{errors.type.message}</p>
                )}
              </div>

              {/* Category */}
              <div className="category">
                <Label htmlFor="category">Select Category</Label>
                <Select
                  onValueChange={(value) => setValue("category", value)}
                  name="category"
                  id="category"
                  className="w-full"
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCategories?.map((category) => (
                      <SelectItem key={category.id} value={category.category}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-red-500">{errors.category.message}</p>
                )}
              </div>

              {/* sub categories */}
              {type === "EXPENSE" && (
                <div className="sub-category">
                  <Label htmlFor="subCategory">Select Sub Category</Label>
                  <Select
                    onValueChange={(value) => setValue("subCategory", value)}
                    value={watch("subCategory")}
                    name="subCategory"
                    id="subCategory"
                    className="w-full"
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Sub Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredSubCategories.map((subCategory) => (
                        <SelectItem key={subCategory} value={subCategory}>
                          {subCategory}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.subCategory && (
                    <p className="text-red-500">{errors.subCategory.message}</p>
                  )}
                </div>
              )}

              {/* Transfer Account id */}
              {type === "TRANSFER" && category === "Self" && (
                <div className="transfer-account">
                  <Label htmlFor="transferAccountId">
                    Select Transfer Account
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setValue("transferAccountId", value)
                    }
                    value={watch("transferAccountId")}
                    name="transferAccountId"
                    id="transferAccountId"
                    className="w-full"
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Transfer Account" />
                    </SelectTrigger>
                    <SelectContent>
                      {bankAccount?.otherAccounts?.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {`${account.bankName} 👉 ${account.openingBalance}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.transferAccountId && (
                    <p className="text-red-500">
                      {errors.transferAccountId.message}
                    </p>
                  )}
                </div>
              )}
              {/* Amount */}
              <div className="amount">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  {...register("amount")}
                  type="number"
                  id="amount"
                  placeholder="Enter amount"
                  className="w-full"
                />
                {errors.amount && (
                  <p className="text-red-500">{errors.amount.message}</p>
                )}
              </div>

              {/* Date */}
              <div className="date">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !watch("date") && "text-muted-foreground"
                      )}
                    >
                      {watch("date") ? (
                        format(watch("date"), "PP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      mode="single"
                      selected={watch("date")}
                      onSelect={(date) => setValue("date", date)}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      className="rounded-md border"
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && (
                  <p className="text-red-500">{errors.date.message}</p>
                )}
              </div>

              <div className="description">
                <Label htmlFor="description">Description</Label>
                <Input
                  {...register("description")}
                  type="text"
                  id="description"
                  placeholder="Enter description"
                  className="w-full"
                />
                {errors.description && (
                  <p className="text-red-500">{errors.description.message}</p>
                )}
              </div>

              <div className="status">
                <Label htmlFor="status">Status</Label>
                <Select
                  onValueChange={(value) => setValue("status", value)}
                  value={watch("status")}
                  name="status"
                  id="status"
                  className="w-full"
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COMPLETED">✅ Completed</SelectItem>
                    <SelectItem value="PENDING">🕓 Pending</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-red-500">{errors.status.message}</p>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  title="Cancel Transaction"
                >
                  Cancel
                </Button>
                <Button type="submit" title="Add Transaction">
                  Add Transaction
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
};

export default AddTransactionPage;

"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight, Pen, Trash } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { updateDefaultAccount } from "@/actions/bankAccount";
import useFetch from "@/hooks/use-Fetch";
import Link from "next/link";
import { toast } from "sonner";
import { useEffect } from "react";

const AccountCard = ({ account }) => {
  const { id, bankName, isDefault, openingBalance: balance } = account;

  const {
    loading: updateDefaultLoading,
    apiFun: updateDefaultFn,
    apiRes: updatedAccount,
    error,
  } = useFetch(updateDefaultAccount);

  const handleDefaultChange = async (bankAccountId) => {
    // event.preventDefault();
    if (isDefault) {
      toast.warning("You need at least one default account");
      return;
    }
    await updateDefaultFn(bankAccountId);
  };

  useEffect(() => {
    if (updatedAccount && !updateDefaultLoading) {
      toast.success("Default account updated successfully");
    }
  }, [updatedAccount]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update default account");
    }
  }, [error]);

  return (
    <div>
      <Card className="hover:shadow-xl transition-shadow group relative">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium capitalize">
            {bankName}
          </CardTitle>
          <Switch
            checked={isDefault === true ? true : false}
            onClick={() => handleDefaultChange(id)}
            disabled={updateDefaultLoading}
          />
        </CardHeader>
        {/* <Link href={`/account/${id}`}> */}
        <Link href={`/bank/account/${id}`}>
          <CardContent>
            <div className="text-2xl font-bold">
              ${parseFloat(balance).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground"> Account</p>
          </CardContent>
          <CardFooter className="flex justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
              Income
            </div>
            <div className="flex items-center">
              <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
              Expense
            </div>
          </CardFooter>
        </Link>
      </Card>
    </div>
  );
};

export default AccountCard;

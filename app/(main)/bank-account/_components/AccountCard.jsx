import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { updateDefaultAccount } from "@/actions/bankAccount";
import useFetch from "@/hooks/use-Fetch";
import Link from "next/link";

const AccountCard = ({ account }) => {
  const { id, bankName, isDefault, openingBalance: balance } = account;
  const {
    loading: updateDefaultLoading,
    apiFun: updateDefaultFn,
    apiRes: updatedAccount,
    error,
  } = useFetch(updateDefaultAccount);

  const handleDefaultChange = () => {};

  return (
    <div>
      <Card className="hover:shadow-md transition-shadow group relative">
        <Link href={`/account/${id}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium capitalize">
              {bankName}
            </CardTitle>
            <Switch
              checked={isDefault}
              onClick={handleDefaultChange}
              disabled={updateDefaultLoading}
            />
          </CardHeader>
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

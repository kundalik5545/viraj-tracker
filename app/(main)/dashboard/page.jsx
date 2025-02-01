import { AuthGuard } from "@/components/auth-guard";
import {
  CircleArrowDown,
  CircleArrowUp,
  DollarSign,
  FileChartColumn,
  Landmark,
  Pencil,
  Search,
  Trash,
  TrendingUp,
  X,
} from "lucide-react";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import QuickStatCard from "../bank-account/_components/QuickStats";
import { expenseTrans, incomeTrans } from "@/data/Categories";
import { formatCurrencyINR } from "@/lib/currencyFormatter";
import { Progress } from "@/components/ui/progress";

const filterPeriod = [
  "Today",
  "Last Week",
  "Last Month",
  "Last 3 Months",
  "Last 6 Months",
  "Last Year",
];
const transactionStatusColors = {
  COMPLETED: "bg-blue-50 text-blue-500",
  PENDING: "bg-yellow-50 text-yellow-500",
  EXPIRED: "bg-red-50 text-red-500",
};

const transactionTypeColors = {
  INCOME: "bg-blue-50 text-blue-500",
  TRANSFER: "bg-purple-50 text-purple-500",
  INVESTMENT: "bg-pink-50 text-pink-500",
  EXPENSE: "bg-red-50 text-red-500",
};
const transactionAmountColors = {
  INCOME: "text-blue-500",
  TRANSFER: "text-purple-500",
  INVESTMENT: "text-pink-500",
  EXPENSE: "text-red-500",
};

const DashboardPage = () => {
  let bankBalance = 10000;
  return (
    <AuthGuard>
      <div className="container mx-auto p-2 md:p-3 pt-4 md:pt-2  ">
        {/* Header Section */}
        <section className="flex items-center justify-between mb-2">
          <h2 className="flex items-center gradient-subTitle text-3xl space-x-3">
            <span className="bg-blue-100 rounded-full p-2 shadow-lg">
              <FileChartColumn color="black" size={25} />
            </span>
            <span>Dashboard</span>
          </h2>
          <Select className="bg-black">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={"Monthly"} />
            </SelectTrigger>
            <SelectContent>
              {filterPeriod.map((item, index) => {
                return (
                  <SelectItem key={index} value={item}>
                    {item}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </section>
        <hr className="mb-2" />

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pl-3 pr-3 pb-1 md:pb-4">
          <QuickStatCard
            topTitle={"Total Balance"}
            MainAmt={bankBalance}
            iconName={<DollarSign />}
            statsChange={"+3.4% Increase from last month."}
            statTextColor={"text-green-500"}
            bgColor={"bg-green-200"}
          />
          <QuickStatCard
            topTitle={"Monthly Income"}
            MainAmt={bankBalance}
            iconName={<CircleArrowUp color="blue" />}
            statsChange={"+3.4% Increase from last month."}
            statTextColor={"text-blue-500"}
            bgColor={"bg-blue-200"}
          />
          <QuickStatCard
            topTitle={"Monthly Expense"}
            MainAmt={bankBalance}
            iconName={<CircleArrowDown color="red" />}
            statsChange={"+3.4% Increase from last month."}
            statTextColor={"text-red-500"}
            bgColor={"bg-red-200"}
          />
          <QuickStatCard
            topTitle={"Income - Expense"}
            MainAmt={bankBalance}
            iconName={<TrendingUp />}
            statsChange={"+3.4% Increase from last month."}
            statTextColor={"text-purple-500"}
            bgColor={"bg-purple-200"}
          />
        </section>

        {/* Expense Transaction with category and percentage of total transaction
          for the selected period */}
        <div className="mb-2">
          <h3 className="text-3xl gradient-subTitle mt-2">
            # Expense Transaction
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {/* Expense */}
            <section className="w-full md:w-[calc(50%-6px)]">
              <Table className="mt-2">
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="py-2">Expense Category</TableHead>
                    <TableHead className="py-2 text-right">Amount</TableHead>
                    <TableHead className="py-2 text-right">
                      Percentage
                    </TableHead>
                    <TableHead className="py-2">Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenseTrans.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell>{data.category}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrencyINR(data.amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        {data.percentage}%
                      </TableCell>
                      <TableCell>
                        <Progress value={data.progress} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={1}>Total</TableCell>
                    <TableCell className="text-right">
                      {formatCurrencyINR(23450)}
                    </TableCell>
                    <TableCell colSpan={1} className="text-right">
                      100.00%
                    </TableCell>
                    <TableCell colSpan={1} className="text-right"></TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </section>

            {/* Income */}
            <section className="w-full md:w-[calc(50%-6px)]">
              <Table className="mt-2">
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="py-2">Income Category</TableHead>
                    <TableHead className="py-2 text-right">Amount</TableHead>
                    <TableHead className="py-2 text-right">
                      Percentage
                    </TableHead>
                    <TableHead className="py-2">Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incomeTrans.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell>{data.category}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrencyINR(data.amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        {data.percentage}%
                      </TableCell>
                      <TableCell>
                        <Progress value={data.progress} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={1}>Total</TableCell>
                    <TableCell className="text-right">
                      {formatCurrencyINR(73450)}
                    </TableCell>
                    <TableCell colSpan={1} className="text-right">
                      100.00%
                    </TableCell>
                    <TableCell colSpan={1} className="text-right"></TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </section>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default DashboardPage;

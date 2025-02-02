"use client";
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
import React, { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { getExpenseTransactions } from "@/actions/dashboard";

const filterPeriod = [
  { period: "Today", value: 1 },
  { period: "Last Week", value: 7 },
  { period: "Last Month", value: 30 },
  { period: "Last 3 Months", value: 90 },
  { period: "Last 6 Months", value: 180 },
  { period: "Last Year", value: 365 },
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
  const [transactionFilterDay, setTransactionFilterDay] = useState(30);
  const [expenseTransactions, setExpenseTransactions] = useState({});
  const [incomeTransactions, setIncomeTransactions] = useState({});
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [diffInIncomeExpense, setDiffInIncomeExpense] = useState(0);

  let bankBalance = 10000;

  const handleTransactionFilter = (value) => {
    setTransactionFilterDay(value);
  };

  const filterTransactions = async (transactionFilterDay) => {
    const response = await getExpenseTransactions(transactionFilterDay);
    setExpenseTransactions(response.expenseSummary);
    setIncomeTransactions(response.incomeSummary);
    setTotalIncome(response.totalIncomeAmount);
    setTotalExpense(response.totalExpenseAmount);
  };

  // setDiffInIncomeExpense(totalIncome - totalExpense);
  useEffect(() => {
    setDiffInIncomeExpense(totalIncome - totalExpense);
  }, [totalExpense, totalIncome]);

  useEffect(() => {
    filterTransactions(transactionFilterDay);
  }, [transactionFilterDay]);

  return (
    <AuthGuard>
      <div className="container mx-auto p-2 md:p-3 pt-[70px] md:pt-2  ">
        {/* Header Section */}
        <section className=" flex items-center justify-between mb-2">
          <h2 className="flex items-center gradient-subTitle text-3xl space-x-3">
            <span className="bg-blue-100 rounded-full p-2 shadow-lg">
              <FileChartColumn color="black" size={25} />
            </span>
            <span>Dashboard</span>
          </h2>
          <div className="hidden md:flex items-center space-x-2">
            <Select onValueChange={(value) => handleTransactionFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={"Monthly"} />
              </SelectTrigger>
              <SelectContent>
                {filterPeriod.map((item, index) => {
                  return (
                    <SelectItem key={index} value={item.value}>
                      {item.period}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </section>
        <hr className="mb-2" />

        {/* quick stats */}
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
            MainAmt={totalIncome}
            iconName={<CircleArrowUp color="blue" />}
            statsChange={"+3.4% Increase from last month."}
            statTextColor={"text-blue-500"}
            bgColor={"bg-blue-200"}
          />
          <QuickStatCard
            topTitle={"Monthly Expense"}
            MainAmt={totalExpense}
            iconName={<CircleArrowDown color="red" />}
            statsChange={"+3.4% Increase from last month."}
            statTextColor={"text-red-500"}
            bgColor={"bg-red-200"}
          />
          <QuickStatCard
            topTitle={"Income - Expense"}
            MainAmt={diffInIncomeExpense}
            iconName={<TrendingUp />}
            statsChange={"+3.4% Increase from last month."}
            statTextColor={"text-purple-500"}
            bgColor={"bg-purple-200"}
          />
        </section>

        {/* Expense Transaction with category and percentage of total transaction
          for the selected period */}
        <div className="mb-2">
          <div className="flex flex-wrap justify-center gap-3">
            {/* Expense */}
            <section className="w-full md:w-[calc(50%-6px)]">
              <h3 className="text-3xl gradient-subTitle mt-2">
                # Expense Transaction
              </h3>
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
                  {expenseTransactions.length > 0 &&
                    expenseTransactions?.map((data, index) => (
                      <TableRow key={index}>
                        <TableCell>{data.category}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrencyINR(data.amount)}
                        </TableCell>
                        <TableCell className="text-right">
                          {data.percentage}%
                        </TableCell>
                        <TableCell>
                          <Progress value={data.percentage} />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={1}>Total</TableCell>
                    <TableCell className="text-right">
                      {formatCurrencyINR(totalExpense)}
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
              <h3 className="text-3xl gradient-subTitle mt-2">
                # Income Trnsactions
              </h3>
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
                  {incomeTransactions.length > 0 &&
                    incomeTransactions.map((data, index) => (
                      <TableRow key={index}>
                        <TableCell>{data.category}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrencyINR(data.amount)}
                        </TableCell>
                        <TableCell className="text-right">
                          {data.percentage}%
                        </TableCell>
                        <TableCell>
                          <Progress value={data.percentage} />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={1}>Total</TableCell>
                    <TableCell className="text-right">
                      {formatCurrencyINR(totalIncome)}
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

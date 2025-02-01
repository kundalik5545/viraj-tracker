"use client";

import {
  Ban,
  ChevronLeft,
  ChevronRight,
  CircleArrowDown,
  CircleArrowUp,
  DollarSign,
  Landmark,
  Plus,
  TrendingUp,
} from "lucide-react";
import React, { Suspense, use, useEffect, useState } from "react";
import AddBankAccount from "./_components/AddBankAccount";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-Fetch";
import { getBankAccount } from "@/actions/bankAccount";
import AccountCard from "./_components/AccountCard";
import QuickStatCard from "./_components/QuickStats";
import useBankStats from "./_components/useBankStats";
import BankBalanceBarChart from "./_components/BankBalanceBarChart";
import BankBalanceDoughnutChart from "./_components/BankBalanceDougntPie";
import { useAuth } from "@clerk/nextjs";
const BankAccountsPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [revalidatePage, setRevalidatePage] = useState(false);

  // to get the bank stats
  const { balance, loading, error } = useBankStats();

  let totalBalance = balance?.totalBalance;
  let totalExpense = balance?.totalExpense;
  let totalIncome = balance?.totalIncome;

  //calculating total income is % of total balance
  const totalIncomePercentage = ((totalIncome / totalBalance) * 100).toFixed(2);
  //calculating total expense is % of total balance
  const totalExpensePercentage = ((totalExpense / totalBalance) * 100).toFixed(
    2
  );
  // calculating total expense is % of total income
  const totalExpenseOfIncome = ((totalExpense / totalIncome) * 100).toFixed(2);

  const {
    apiFun: getBankFn,
    apiRes: getBankAccountRes,
    loading: getBankLoading,
    error: getBankError,
  } = useFetch(getBankAccount);

  const fetchBankAccount = async () => {
    await getBankFn(currentPage);
  };

  const handlePagination = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (revalidatePage) {
      fetchBankAccount();
      setRevalidatePage(false);
    }
    fetchBankAccount();
  }, [revalidatePage, currentPage]);

  useEffect(() => {
    if (getBankAccountRes && !getBankLoading) {
      setAccounts(getBankAccountRes.data.bankAccounts);
      setCurrentPage(getBankAccountRes.data.currentPage);
      setTotalPages(getBankAccountRes.data.totalPages);
    }
  }, [getBankAccountRes]);

  useEffect(() => {
    if (getBankError) {
      console.log(getBankError);
    }
  }, [getBankError]);

  return (
    <div>
      {/* Header Section  with add bank account button*/}
      <section className="flex items-center justify-between mb-2 mt-2">
        <h2 className="flex items-center gradient-subTitle text-3xl space-x-3">
          <span className="bg-blue-100 rounded-full p-2 shadow-lg">
            <Landmark color="black" size={25} />
          </span>
          <span>Bank</span>
        </h2>
        <AddBankAccount setRevalidatePage={setRevalidatePage}>
          <Button>
            <Plus size={20} />
            <span>Add Bank Account</span>
          </Button>
        </AddBankAccount>
      </section>

      <hr className="mb-2" />

      {/* Quick Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pl-3 pr-3 pb-1 md:pb-4">
        <QuickStatCard
          topTitle={"Total Balance"}
          MainAmt={!loading && balance?.totalBalance}
          iconName={<DollarSign />}
          statsChange={"+3.4% Increase from last month."}
          statTextColor={"text-green-500"}
          bgColor={"bg-green-200"}
        />
        <QuickStatCard
          topTitle={"Monthly Income"}
          MainAmt={!loading && balance?.totalIncome}
          iconName={<CircleArrowUp color="blue" />}
          statsChange={`${totalIncomePercentage}% of total Balance.`}
          statTextColor={"text-blue-500"}
          bgColor={"bg-blue-200"}
        />
        <QuickStatCard
          topTitle={"Monthly Expense"}
          MainAmt={!loading && balance?.totalExpense}
          iconName={<CircleArrowDown color="red" />}
          statsChange={`${totalExpensePercentage}% of total Balance this month.`}
          statTextColor={"text-red-500"}
          bgColor={"bg-red-200"}
        />
        <QuickStatCard
          topTitle={"Income - Expense"}
          MainAmt={!loading && balance.totalRemaingBalance}
          iconName={<TrendingUp />}
          statsChange={` ${totalExpenseOfIncome}% 
          Expense of Total Income this month.`}
          statTextColor={"text-purple-500"}
          bgColor={"bg-purple-200"}
        />
      </section>

      {/* Balance Chart */}
      <section className="flex items-center justify-around flex-wrap flex-1 mt-4 space-y-4 md:space-y-0 pl-2 md:pl-0 mr-2 md:mr-0">
        <BankBalanceBarChart balance={balance} />
        <BankBalanceDoughnutChart balance={balance} />
      </section>

      <hr className="mb-5 mt-3" />
      {/* Accounts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-3 md:p-0">
        <Suspense fallback={<div>Loading...</div>}>
          {accounts.length > 0 &&
            accounts?.map((account) => {
              return <AccountCard key={account.id} account={account} />;
            })}
        </Suspense>
        {totalPages > 1 && (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePagination(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft />
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePagination(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight />
            </Button>
          </div>
        )}
      </div>

      <hr className="mb-2 mt-2" />

      {/* Display Charts */}
    </div>
  );
};

export default BankAccountsPage;

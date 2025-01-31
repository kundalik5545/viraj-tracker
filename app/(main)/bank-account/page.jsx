"use client";

import {
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

const BankAccountsPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [revalidatePage, setRevalidatePage] = useState(false);

  const { balance, loading, error } = useBankStats();

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
          MainAmt={balance}
          iconName={<DollarSign />}
          statsChange={"+3.4% Increase from last month."}
          statTextColor={"text-green-500"}
          bgColor={"bg-green-200"}
        />
        <QuickStatCard
          topTitle={"Monthly Income"}
          MainAmt={balance}
          iconName={<CircleArrowUp color="blue" />}
          statsChange={"+3.4% Increase from last month."}
          statTextColor={"text-blue-500"}
          bgColor={"bg-blue-200"}
        />
        <QuickStatCard
          topTitle={"Monthly Expense"}
          MainAmt={balance}
          iconName={<CircleArrowDown color="red" />}
          statsChange={"+3.4% Increase from last month."}
          statTextColor={"text-red-500"}
          bgColor={"bg-red-200"}
        />
        <QuickStatCard
          topTitle={"Income - Expense"}
          MainAmt={balance}
          iconName={<TrendingUp />}
          statsChange={"+3.4% Increase from last month."}
          statTextColor={"text-purple-500"}
          bgColor={"bg-purple-200"}
        />
      </section>

      {/* Accounts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

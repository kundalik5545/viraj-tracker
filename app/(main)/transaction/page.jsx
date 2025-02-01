"use client";
import { AuthGuard } from "@/components/auth-guard";
import {
  ChevronLeft,
  ChevronRight,
  FileChartColumn,
  Pencil,
  Trash,
} from "lucide-react";
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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { getTransaction } from "@/actions/transaction";
import clsx from "clsx";
import { formatCurrencyINR } from "@/lib/currencyFormatter";
import { Button } from "@/components/ui/button";

const filterType = ["All", "Income", "Expense", "Transfer", "Investment"];
const filterPeriod = ["Daily", "Weekly", "Monthly", "Yearly"];
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

const TransactionPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [updateData, setUpdateData] = useState(false);

  const getUserDetail = async () => {
    const response = await getTransaction(currentPage);
    if (response.success) {
      setResultData(response.data);
      setTotalPages(response.data.totalPages);
      setTotalRecords(response.data.totalRecords);
    } else {
      toast.error(response.message);
    }
  };

  useEffect(() => {
    // if (updateData) {
    //   getUserDetail();
    //   setUpdateData(false);
    // }
    getUserDetail();
  }, []);

  useEffect(() => {
    if (updateData) {
      getUserDetail();
      setUpdateData(false);
    }
    getUserDetail();
  }, [updateData, currentPage]);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <AuthGuard>
      {/* Header Section */}
      <section className="flex items-center justify-between mb-2 mt-2">
        <h2 className="flex items-center gradient-subTitle text-3xl space-x-3">
          <span className="bg-blue-100 rounded-full p-2 shadow-lg">
            <FileChartColumn color="black" size={25} />
          </span>
          <span>Transactions</span>
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

      {/* Display recent transaction */}
      <div className="flex items-center justify-between mb-2 border-b-2 pb-2">
        <h3 className="text-3xl gradient-subTitle"># Recent Transactions</h3>
        <Select className="bg-black">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={"All"} />
          </SelectTrigger>
          <SelectContent>
            {filterType.map((item, index) => {
              return (
                <SelectItem key={index} value={item}>
                  {item}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      <section>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Sr. No</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resultData?.allTransactions?.length > 0 &&
              resultData.allTransactions.map((data, index) => {
                return (
                  <TableRow key={data.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {new Date(data.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{data.description}</TableCell>
                    <TableCell>
                      <span
                        className={clsx(
                          transactionTypeColors[data.type],
                          "px-2 py-1 text-xs font-medium rounded-full"
                        )}
                      >
                        {data.type.toLowerCase().charAt(0).toUpperCase() +
                          data.type.slice(1).toLowerCase()}
                      </span>
                    </TableCell>
                    <TableCell>
                      {data.category.charAt(0).toUpperCase() +
                        data.category.slice(1).toLowerCase()}
                    </TableCell>
                    <TableCell>
                      <span
                        className={clsx(
                          transactionAmountColors[data.type],
                          "text-sm font-medium"
                        )}
                      >
                        {data.type === "EXPENSE" ? "-" : "+"}
                        {formatCurrencyINR(data.amount)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={clsx(
                          transactionStatusColors[data.status],
                          "px-2 py-1 text-xs font-medium rounded-full"
                        )}
                      >
                        {data.status.charAt(0).toUpperCase() +
                          data.status.slice(1).toLowerCase()}
                      </span>
                    </TableCell>
                    <TableCell className="flex">
                      <Button variant="ghost" className="p-0">
                        <Pencil color="blue" />
                      </Button>
                      <Button variant="ghost">
                        <Trash color="red" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
        {totalPages > 1 && (
          <div className="flex items-center justify-center mt-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft />
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight />
            </Button>
          </div>
        )}
      </section>
    </AuthGuard>
  );
};

export default TransactionPage;

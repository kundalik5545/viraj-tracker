"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Edit2, Trash2, Building2, Phone, Mail, MapPin } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { deleteBank, getBankAccountById } from "@/actions/bankAccount";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateBankAccountSchema } from "@/lib/Schema";

const transactions = [
  {
    id: "TXN001",
    date: new Date("2024-03-20"),
    description: "Salary Credit",
    type: "credit",
    amount: 5000.0,
    status: "completed",
  },
  {
    id: "TXN002",
    date: new Date("2024-03-19"),
    description: "Online Purchase",
    type: "debit",
    amount: 89.99,
    status: "completed",
  },
  {
    id: "TXN003",
    date: new Date("2024-03-18"),
    description: "ATM Withdrawal",
    type: "debit",
    amount: 200.0,
    status: "completed",
  },
  {
    id: "TXN004",
    date: new Date("2024-03-17"),
    description: "Investment Return",
    type: "credit",
    amount: 350.0,
    status: "pending",
  },
  {
    id: "TXN002",
    date: new Date("2024-03-19"),
    description: "Online Purchase",
    type: "debit",
    amount: 89.99,
    status: "completed",
  },
  {
    id: "TXN003",
    date: new Date("2024-03-18"),
    description: "ATM Withdrawal",
    type: "debit",
    amount: 200.0,
    status: "completed",
  },
  {
    id: "TXN004",
    date: new Date("2024-03-17"),
    description: "Investment Return",
    type: "credit",
    amount: 350.0,
    status: "pending",
  },
];

export default function BankAccountDetailsPage({ params }) {
  const bankAccountDetailItem = {
    bankName: "",
    date: "",
    openingBalance: "",
    isDefaut: "",
    accountNumber: "",
    ifscCode: "",
    branchName: "",
    phone: "",
    email: "",
    address: "",
  };

  const [bankAccountDetails, setBankAccountDetails] = useState(
    bankAccountDetailItem
  );

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateBankAccountSchema),
    defaultValues: {
      bankName: "",
      date: "",
      openingBalance: "",
      isDefaut: "",
      accountNumber: "",
      ifscCode: "",
      branchName: "",
      phone: "",
      email: "",
      address: "",
    },
  });

  const onSubmit = (data) => {
    setIsEditDialogOpen(false);
  };

  const handleDeleteAccount = async () => {
    const response = await deleteBank(params.id);
    if (response) {
      toast.success("Account deleted successfully");
      redirect("/bank-account");
    }
  };

  const getBankDetails = async () => {
    const response = await getBankAccountById(params.id);
    if (response) {
      setBankAccountDetails(response?.data);
    }
  };

  useEffect(() => {
    getBankDetails();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 mt-10 md:mt-0">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Account Overview */}
        <Card>
          <CardHeader className="flex flex-col md:flex-row items-center justify-between space-y-0 pb-4">
            <div className="mb-2 md:mb-0">
              <CardTitle className="text-3xl md:text-2xl font-bold">
                <span className="text-2xl gradient-subTitle">
                  {bankAccountDetails?.bankName
                    ?.split(" ")
                    .map(
                      (word) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                    )
                    .join(" ")}
                </span>
              </CardTitle>
              <CardDescription>
                View and manage your bank account information
              </CardDescription>
            </div>
            <div className="hidden md:flex space-x-2 ">
              <Dialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Edit2 className="mr-2 h-4 w-4 " />
                    <span className="hidden md:block">Edit Details</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Account Details</DialogTitle>
                    <DialogDescription>
                      Make changes to your account information here.
                    </DialogDescription>
                  </DialogHeader>
                  <form className="space-y-4">
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="bankName" className="text-left">
                          Bank Name
                        </Label>
                        <div className="flex flex-col col-span-3">
                          <Input
                            id="bankName"
                            type="text"
                            {...register("bankName")}
                            className="col-span-3"
                          />
                          {errors.bankName && (
                            <p className="text-red-500 text-sm">
                              {errors.bankName.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="accountNumber" className="text-left">
                          Account No
                        </Label>
                        <div className="flex flex-col col-span-3">
                          <Input
                            id="accountNumber"
                            type="text"
                            {...register("accountNumber")}
                            className="col-span-3"
                          />
                          {errors.accountNumber && (
                            <p className="text-red-500 text-sm">
                              {errors.accountNumber.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="ifscCode" className="text-left">
                          IFSC Code
                        </Label>
                        <div className="flex flex-col col-span-3">
                          <Input
                            id="ifscCode"
                            type="text"
                            {...register("ifscCode")}
                            className="col-span-3"
                          />
                          {errors.ifscCode && (
                            <p className="text-red-500 text-sm">
                              {errors.ifscCode.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="branchName" className="text-left">
                          Branch Name
                        </Label>
                        <div className="flex flex-col col-span-3">
                          <Input
                            id="branchName"
                            type="text"
                            {...register("branchName")}
                            className="col-span-3"
                          />
                          {errors.branchName && (
                            <p className="text-red-500 text-sm">
                              {errors.branchName.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-left">
                          Branch Phone
                        </Label>
                        <div className="flex flex-col col-span-3">
                          <Input
                            id="phone"
                            type="phone"
                            {...register("phone")}
                            className="col-span-3"
                          />
                          {errors.phone && (
                            <p className="text-red-500 text-sm">
                              {errors.phone.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-left">
                          Branch Email
                        </Label>
                        <div className="flex flex-col col-span-3">
                          <Input
                            id="email"
                            type="email"
                            {...register("email")}
                            className="col-span-3"
                          />
                          {errors.email && (
                            <p className="text-red-500 text-sm">
                              {errors.email.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="address" className="text-left">
                          Branch Addres.
                        </Label>
                        <div className="flex flex-col col-span-3">
                          <Input
                            id="address"
                            type="text"
                            {...register("address")}
                            className="col-span-3"
                          />
                          {errors.address && (
                            <p className="text-red-500 text-sm">
                              {errors.address.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="btn">
                      <Button
                        type="submit"
                        variant="default"
                        onClick={onSubmit}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span className="hidden md:block">Delete Account</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount}>
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardHeader>
          <CardContent className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold  ">Account Information</h3>
                <div className=" mt-2 md:mt-4 space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <span className="text-sm text-gray-500">
                      Account Number
                    </span>
                    <span className="font-medium">
                      {bankAccountDetails.accountNumber}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <span className="text-sm text-gray-500">IFSC Code</span>
                    <span className="font-medium">
                      {bankAccountDetails.ifscCode}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <span className="text-sm text-gray-500">Branch Name</span>
                    <span className="font-medium">
                      {bankAccountDetails.branchName}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Contact Information</h3>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center space-x-3 rounded-lg border p-4">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <span>{bankAccountDetails.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3 rounded-lg border p-4">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <span>{bankAccountDetails.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 rounded-lg border p-4">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <span>{bankAccountDetails.address}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:hidden flex space-x-1 ">
              <Dialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Edit2 className="  h-4 w-4 " />
                    <span className="">Edit Details</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Account Details</DialogTitle>
                    <DialogDescription>
                      Make changes to your account information here.
                    </DialogDescription>
                  </DialogHeader>
                  <form className="space-y-4">
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="bankName" className="text-left">
                          Bank Name
                        </Label>
                        <div className="flex flex-col col-span-3">
                          <Input
                            id="bankName"
                            type="text"
                            {...register("bankName")}
                            className="col-span-3"
                          />
                          {errors.bankName && (
                            <p className="text-red-500 text-sm">
                              {errors.bankName.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="accountNumber" className="text-left">
                          Account No
                        </Label>
                        <div className="flex flex-col col-span-3">
                          <Input
                            id="accountNumber"
                            type="text"
                            {...register("accountNumber")}
                            className="col-span-3"
                          />
                          {errors.accountNumber && (
                            <p className="text-red-500 text-sm">
                              {errors.accountNumber.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="ifscCode" className="text-left">
                          IFSC Code
                        </Label>
                        <div className="flex flex-col col-span-3">
                          <Input
                            id="ifscCode"
                            type="text"
                            {...register("ifscCode")}
                            className="col-span-3"
                          />
                          {errors.ifscCode && (
                            <p className="text-red-500 text-sm">
                              {errors.ifscCode.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="branchName" className="text-left">
                          Branch Name
                        </Label>
                        <div className="flex flex-col col-span-3">
                          <Input
                            id="branchName"
                            type="text"
                            {...register("branchName")}
                            className="col-span-3"
                          />
                          {errors.branchName && (
                            <p className="text-red-500 text-sm">
                              {errors.branchName.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-left">
                          Branch Phone
                        </Label>
                        <div className="flex flex-col col-span-3">
                          <Input
                            id="phone"
                            type="phone"
                            {...register("phone")}
                            className="col-span-3"
                          />
                          {errors.phone && (
                            <p className="text-red-500 text-sm">
                              {errors.phone.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-left">
                          Branch Email
                        </Label>
                        <div className="flex flex-col col-span-3">
                          <Input
                            id="email"
                            type="email"
                            {...register("email")}
                            className="col-span-3"
                          />
                          {errors.email && (
                            <p className="text-red-500 text-sm">
                              {errors.email.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="address" className="text-left">
                          Branch Addres.
                        </Label>
                        <div className="flex flex-col col-span-3">
                          <Input
                            id="address"
                            type="text"
                            {...register("address")}
                            className="col-span-3"
                          />
                          {errors.address && (
                            <p className="text-red-500 text-sm">
                              {errors.address.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="btn">
                      <Button
                        type="submit"
                        variant="default"
                        onClick={onSubmit}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4" />
                    <span className="block">Delete Account</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount}>
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Your recent account activity and transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {format(transaction.date, "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell className="font-mono">
                      {transaction.id}
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          transaction.type === "credit"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={
                          transaction.type === "credit"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {transaction.type === "credit" ? "+" : "-"}$
                        {transaction.amount.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          transaction.status === "completed"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

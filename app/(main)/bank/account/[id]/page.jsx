"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Building,
  Pencil,
  Trash2,
  FileText,
  Clock,
  Mail,
  Phone,
  FileCheck,
  Building2,
  Settings,
  Download,
  HelpCircle,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Bell,
  CreditCard,
  Wallet,
  Edit2,
  Wifi,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { formatCurrencyINR } from "@/lib/currencyFormatter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateBankAccountSchema } from "@/lib/Schema";
import {
  deleteBank,
  editBank,
  getBankAccountById,
} from "@/actions/bankAccount";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const recentTransactions = [
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
    id: "TXN005",
    date: new Date("2024-03-19"),
    description: "Online Purchase",
    type: "debit",
    amount: 89.99,
    status: "completed",
  },
  {
    id: "TXN006",
    date: new Date("2024-03-18"),
    description: "ATM Withdrawal",
    type: "debit",
    amount: 200.0,
    status: "completed",
  },
  {
    id: "TXN007",
    date: new Date("2024-03-17"),
    description: "Investment Return",
    type: "credit",
    amount: 350.0,
    status: "pending",
  },
];

export default function BankAccountsPage({ params }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCardFlipped1, setIsCardFlipped1] = useState(false);
  const [isCardFlipped2, setIsCardFlipped2] = useState(false);
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

  const onSubmit = async (data) => {
    const response = await editBank(params.id, data);
    if (response) {
      toast.success("Account updated successfully");
      setIsEditDialogOpen(false);
      getBankDetails();
    }
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
      <div className="mt-4 md:mt-0 mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Account Overview</h1>
          <p className="text-sm text-gray-500">
            Last updated {format(new Date(), "MMM d, yyyy 'at' h:mm a")}
          </p>
        </div>
        <div className="hidden md:flex gap-3">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit2 className="mr-2 h-4 w-4 " />
                <span className="">Edit</span>
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
                  <Button type="submit" variant="default" onClick={onSubmit}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <AlertDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
          >
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="gap-2">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-destructive text-destructive-foreground"
                >
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className=" md:p-0 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-col md:flex-row gap-3 ">
            <div className="perspective-1000 w-full md:w-1/2">
              <div
                className={`relative h-64 w-full cursor-pointer transition-transform duration-500 preserve-3d ${
                  isCardFlipped1 ? "rotate-y-180" : ""
                }`}
                onClick={() => setIsCardFlipped1(!isCardFlipped1)}
              >
                <div className="absolute inset-0 backface-hidden">
                  <div className="h-full w-full rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 p-6 text-white shadow-xl">
                    <div className="flex justify-between font-semibold text-3xl">
                      {bankAccountDetails.bankName
                        .split(" ")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase()
                        )
                        .join(" ")}{" "}
                      <Wifi className="h-8 w-8 text-white/80" />
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="h-10 w-12 rounded bg-yellow-400/80" />
                      <h3>Debit Card</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="mt-6 font-semibold text-xl md:text-3xl tracking-widest">
                        4567 **** **** 8901
                      </div>
                    </div>
                    <div className="mt-3 flex justify-between gap-4">
                      <div>
                        <p className="text-base text-white/60">Card Holder</p>
                        <p className="font-mono text-base">JOHN DOE</p>
                      </div>
                      <div>
                        <p className="text-base text-white/60">Expires</p>
                        <p className="font-mono text-base">12/25</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 rotate-y-180 backface-hidden">
                  <div className="h-full w-full rounded-xl bg-gradient-to-br from-indigo-700 via-indigo-800 to-indigo-900 p-6 text-white shadow-xl">
                    <div className="mt-8 h-12 bg-neutral-800" />
                    <div className="mt-8 flex justify-end">
                      <div className="h-8 w-24 bg-white/20 text-end font-mono text-sm leading-8 tracking-widest">
                        123
                      </div>
                    </div>
                    <p className="mt-4 text-xs text-white/60">
                      This card is property of Finance Management by
                      Balance-Sheet. If found, please return to any SecureBank
                      branch.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="perspective-1000 w-full md:w-1/2">
              <div
                className={`relative h-64 w-full cursor-pointer transition-transform duration-500 preserve-3d ${
                  isCardFlipped2 ? "rotate-y-180" : ""
                }`}
                onClick={() => setIsCardFlipped2(!isCardFlipped2)}
              >
                <div className="absolute inset-0 backface-hidden">
                  <div className="h-full w-full rounded-xl bg-gradient-to-br from-blue-400  to-red-600 p-6 text-white shadow-xl">
                    <div className="flex justify-between font-semibold text-3xl">
                      {bankAccountDetails.bankName
                        .split(" ")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase()
                        )
                        .join(" ")}{" "}
                      <Wifi className="h-8 w-8 text-white/80" />
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="h-10 w-12 rounded bg-yellow-400/80" />

                      <h3 className=" font-semibold">Credit Card</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="mt-6 font-semibold text-xl md:text-3xl tracking-widest">
                        4567 **** **** 8901
                      </div>
                    </div>
                    <div className="mt-3 flex justify-between gap-4">
                      <div>
                        <p className="text-base text-white/60">Card Holder</p>
                        <p className="font-mono text-base">JOHN DOE</p>
                      </div>
                      <div>
                        <p className="text-base text-white/60">Expires</p>
                        <p className="font-mono text-base">12/25</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 rotate-y-180 backface-hidden">
                  <div className="h-full w-full rounded-xl bg-gradient-to-br from-indigo-700 via-indigo-800 to-indigo-900 p-6 text-white shadow-xl">
                    <div className="mt-8 h-12 bg-neutral-800" />
                    <div className="mt-8 flex justify-end">
                      <div className="h-8 w-24 bg-white/20 text-end font-mono text-sm leading-8 tracking-widest">
                        123
                      </div>
                    </div>
                    <p className="mt-4 text-xs text-white/60">
                      This card is property of Finance Management by
                      Balance-Sheet. If found, please return to any SecureBank
                      branch.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Balance Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card className="bg-gradient-to-br from-blue-600 to-red-700 text-white">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Available Balance</span>
                  <CreditCard className="h-5 w-5 opacity-80" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {formatCurrencyINR(45678)}
                </div>
                <p className="mt-2 text-sm text-indigo-100">
                  Account ending in 4567
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Creadit Card Balance</span>
                  <Wallet className="h-5 w-5 opacity-80" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrencyINR(280000)}
                </div>
                <p className="mt-2 text-sm text-emerald-100">
                  {formatCurrencyINR(22000)} Used this Month{" "}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <hr className="mb-2" />
          <section>
            <h3 className="text-xl font-semibold">Recent Bank Transactions</h3>
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
                {recentTransactions.map((transaction) => (
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
            <div className="mt-4 ">
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
          </section>

          <hr className="mb-2" />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Account Details */}
          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Account Holder
                </p>
                <p className="text-gray-900">John Doe</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Account Number
                </p>
                <p className="font-mono text-gray-900">•••• •••• 4567</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">IFSC Code</p>
                <p className="font-mono text-gray-900">SBIN0001234</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Branch</p>
                <p className="text-gray-900">Main Street Branch</p>
                <p className="text-sm text-gray-500">
                  123 Main St, New York, NY 10001
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { icon: FileText, label: "Download Statement" },
                { icon: FileCheck, label: "Update KYC" },
                { icon: Building2, label: "Change Branch" },
                { icon: Download, label: "Download Forms" },
              ].map((action) => (
                <Button
                  key={action.label}
                  variant="ghost"
                  className="w-full justify-between"
                >
                  <div className="flex items-center gap-2">
                    <action.icon className="h-4 w-4 text-gray-500" />
                    <span>{action.label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Support */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <p className="text-sm">
                  <span className="block font-medium">24/7 Support</span>
                  <span className="text-gray-500">1-800-123-4567</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <p className="text-sm">
                  <span className="block font-medium">Email Support</span>
                  <a
                    href="mailto:support@bank.com"
                    className="text-indigo-600 hover:underline"
                  >
                    support@bank.com
                  </a>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <p className="text-sm">
                  <span className="block font-medium">Branch Hours</span>
                  <span className="text-gray-500">
                    Mon-Fri, 9:00 AM - 5:00 PM
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

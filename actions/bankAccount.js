"use server";
import { prisma } from "@/db/db.config";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// Add Bank Account
export async function addBankAccount(data) {
  try {
    // 1. Check if user exists and is logged in
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized User!");

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // 2. Check incoming data and types
    if (
      !data ||
      typeof data.bankName !== "string" ||
      typeof data.date !== "object" ||
      typeof data.openingBalance !== "number" ||
      typeof data.isDefault !== "boolean"
    ) {
      throw new Error("Please check the provoided data types.");
    }

    // 3. Check bank account exists
    const existingBankAccount = await prisma.bankAccount.findFirst({
      where: {
        userId: user.id,
        bankName: data.bankName.toLowerCase(),
      },
    });

    if (existingBankAccount)
      return {
        success: false,
        message: "Bank account already exists",
        data: null,
      };

    // 4. Create account prisma transaction fn
    const createAccountTransaction = await prisma.$transaction(async (tx) => {
      const newBankAccount = await tx.bankAccount.create({
        data: {
          bankName: data.bankName.toLowerCase(),
          date: data.date,
          openingBalance: data.openingBalance,
          isDefault: data.isDefault,
          userId: user.id,
        },
      });

      if (!newBankAccount) throw new Error("Bank Account not created");

      // 5. If account created successfully and it is new account then create first transaction and then update the account balance.
      if (newBankAccount.id) {
        const firstTransaction = await tx.transaction.create({
          data: {
            userId: user.id,
            bankAccountId: newBankAccount.id,
            type: "INCOME",
            category: "SELF",
            amount: data.openingBalance,
            date: data.date,
            description: "Account created and first deposite made.",
            status: "COMPLETED",
          },
        });

        if (!firstTransaction) throw new Error("First transaction not created");

        const firstAccountDeposite = await tx.accountBalance.create({
          data: {
            userId: user.id,
            bankAccountId: newBankAccount.id,
            transactionId: firstTransaction.id,
            date: data.date,
            totalDeposite: data.openingBalance,
            totalWithdrawal: 0,
            totalBalance: data.openingBalance,
            description: "Account created and first deposite made.",
          },
        });

        if (!firstAccountDeposite)
          throw new Error("First time Deposite failed...");
      }

      return newBankAccount;
    });

    if (!createAccountTransaction) {
      return {
        success: false,
        message: "Bank account creation failed!!",
        data: null,
      };
    }

    revalidatePath("/bank-account");

    if (createAccountTransaction)
      return {
        success: true,
        data: createAccountTransaction,
        message: "Bank account created successfully...",
      };
  } catch (error) {
    console.error(error.message || "Error during creating bank account.");
  }
}

//Get Bank Accounts
export const getBankAccount = async (page = 1) => {
  try {
    // 1. Check if user exists and is logged in
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized User!");

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const pageSize = 8;

    // 2. Get user bank accounts with pagination
    const [bankAccounts, totalRecords] = await Promise.all([
      prisma.BankAccount.findMany({
        where: {
          userId: user.id,
        },
        orderBy: { bankName: "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.BankAccount.count({
        where: {
          userId: user.id,
        },
      }),
    ]);

    const totalPages = Math.ceil(totalRecords / pageSize);

    //3. Convert Decimal values before sending to the client
    const formattedAccounts = bankAccounts.map((account) => ({
      ...account,
      openingBalance: account.openingBalance.toNumber(),
    }));

    //4. Return the response
    return {
      success: true,
      message: "Bank accounts fetched successfully",
      data: {
        bankAccounts: formattedAccounts,
        totalRecords,
        totalPages,
        currentPage: page,
      },
    };
  } catch (error) {
    console.error("Error getting bank accounts:", error.message);
    return {
      success: false,
      message: error.message,
    };
  }
};

// Update Default Bank Account
export async function updateDefaultAccount(data) {
  try {
    // 1. Check if user exists and is logged in
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized User!");

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // 2. Check incoming data and types
    if (
      !data ||
      typeof data.bankAccountId !== "number" ||
      typeof data.isDefault !== "boolean"
    ) {
      throw new Error("Please check the provoided data types.");
    }

    // 3. Check bank account exists
    const existingBankAccount = await prisma.bankAccount.findFirst({
      where: {
        userId: user.id,
        id: data.bankAccountId,
      },
    });

    if (!existingBankAccount)
      return {
        success: false,
        message: "Bank account not found",
        data: null,
      };

    // 4. Update the default account
    const updatedAccount = await prisma.bankAccount.update({
      where: { id: data.bankAccountId },
      data: {
        isDefault: data.isDefault,
      },
    });

    if (!updatedAccount)
      return {
        success: false,
        message: "Default account not updated",
        data: null,
      };

    return {
      success: true,
      message: "Default account updated successfully",
      data: updatedAccount,
    };
  } catch (error) {
    console.error("Error updating default account:", error.message);
    return {
      success: false,
      message: error.message,
    };
  }
}

// Get Bank Balance server action
export async function getBankBalance() {
  try {
    // 1. Check if user exists and is logged in
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized User!");

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // 2. Get user bank accounts
    const bankAccounts = await prisma.bankAccount.findMany({
      where: {
        userId: user.id,
      },
    });

    // 3. Calculate total balance
    const totalBalance = bankAccounts.reduce(
      (acc, account) => acc + account.openingBalance.toNumber(),
      0
    );

    return totalBalance;
  } catch (error) {
    console.error("Error getting bank balance:", error.message);
    return null;
  }
}

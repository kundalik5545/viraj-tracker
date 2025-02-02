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
export async function updateDefaultAccount(bankAccountId) {
  try {
    // 1. Check if user exists and is logged in
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized User!");

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // 3. Check bank account exists
    const existingBankAccount = await prisma.bankAccount.findFirst({
      where: {
        userId: user.id,
        id: bankAccountId,
      },
    });

    if (!existingBankAccount)
      return {
        success: false,
        message: "Bank account not found",
        data: null,
      };

    //4. Make all other account not default
    const updatedOtherAccounts = await prisma.bankAccount.updateMany({
      where: {
        userId: user.id,
      },
      data: {
        isDefault: false,
      },
    });

    if (!updatedOtherAccounts)
      return {
        success: false,
        message: "Other accounts not updated",
        data: null,
      };

    // 4. Update the default account
    const updatedAccount = await prisma.bankAccount.update({
      where: { id: bankAccountId },
      data: {
        isDefault: true,
      },
    });

    if (!updatedAccount)
      return {
        success: false,
        message: "Default account not updated",
        data: null,
      };

    revalidatePath("/bank-account");
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
      (acc, account) =>
        acc + (account.openingBalance ? account.openingBalance.toNumber() : 0),
      0
    );

    const totalExpense = await prisma.transaction.aggregate({
      where: { userId: user.id, type: "EXPENSE" },
      _sum: { amount: true },
    });

    const formatedExpenseSum = totalExpense._sum.amount
      ? totalExpense._sum.amount.toNumber()
      : 0;

    const totalIncome = await prisma.transaction.aggregate({
      where: { userId: user.id, type: "INCOME" },
      _sum: { amount: true },
    });

    const formatedIncomeSum = totalIncome._sum.amount
      ? totalIncome._sum.amount.toNumber()
      : 0;

    // 4. Calculate remaining balance
    const totalRemaingBalance = formatedIncomeSum - formatedExpenseSum;

    return {
      totalBalance: totalBalance || 0,
      totalExpense: formatedExpenseSum || 0,
      totalIncome: formatedIncomeSum || 0,
      totalRemaingBalance: totalRemaingBalance || 0,
    };
  } catch (error) {
    console.error("Error getting bank balance:", error.message);
    return null;
  }
}

// get default bank account and other account with balance
export async function getDefaultBankAccountWithBalance() {
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

    const serializedAccounts = bankAccounts.map((account) => ({
      ...account,
      openingBalance: account.openingBalance.toNumber(),
      date: account.date.toISOString(),
      createdAt: account.createdAt.toISOString(),
      updatedAt: account.updatedAt.toISOString(),
    }));

    // 3. Get default bank account
    const defaultAccount = bankAccounts.find((account) => account.isDefault);

    if (!defaultAccount)
      return {
        success: false,
        message: "Default account not found, Make one default account.",
        data: null,
      };

    return {
      defaultAccount,
      otherAccounts: serializedAccounts || [],
    };
  } catch (error) {
    console.error("Error getting default bank account:", error.message);
    return null;
  }
}

//Delete bank account by id
export const deleteBank = async (id) => {
  try {
    // 1. Check if user exists and is logged in
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized User!");

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // 2. Check bank account exist or not
    const existingBankAccount = await prisma.BankAccount.findUnique({
      where: {
        id: id,
        userId: user.id,
      },
    });

    if (!existingBankAccount) throw new Error("Bank account not found");

    // 2. Delete bank account
    const bankAccount = await prisma.BankAccount.delete({
      where: {
        id: id,
        userId: user.id,
      },
    });

    if (!bankAccount) throw new Error("Bank account not deleted");

    return {
      success: true,
      message: "Bank account deleted successfully",
      data: bankAccount,
    };
  } catch (error) {
    console.error("Error getting investments:", error.message);
    return {
      success: false,
      message: error.message || "Error during deleting bank account",
      data: null,
    };
  }
};

//Edit bank account by id and data
export const editBank = async (id, data) => {
  try {
    // 1. Check if user exists and is logged in
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized User!");

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // 2. Check bank account exist or not
    const existingBankAccount = await prisma.BankAccount.findUnique({
      where: {
        id: id,
        userId: user.id,
      },
    });

    if (!existingBankAccount) throw new Error("Bank account not found");

    // 3. Edit bank account
    const bankAccount = await prisma.BankAccount.update({
      where: {
        id: id,
        userId: user.id,
      },
      data: {
        bankName: data.bankName.toLowerCase(),
        date: data.date,
        openingBalance: data.openingBalance,
        isDefault: data.isDefault,
      },
    });

    if (!bankAccount) throw new Error("Bank account not updated");

    const formatedBankDetails = {
      ...bankAccount,
      openingBalance: bankAccount.openingBalance.toNumber(),
    };
    //make transaction for updating bank account and account balance = > issue in logic
    return {
      success: true,
      message: "Bank account updated successfully",
      data: formatedBankDetails,
    };
  } catch (error) {
    console.error("Error getting investments:", error.message);
    return {
      success: false,
      message: error.message || "Error during updating bank account",
    };
  }
};

// get bank account  details by id
export const getBankAccountById = async (id) => {
  try {
    // 1. Check if user exists and is logged in
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized User!");

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // 2. Check bank account exist or not
    const existingBankAccount = await prisma.BankAccount.findUnique({
      where: {
        id: id,
        userId: user.id,
      },
    });

    if (!existingBankAccount) throw new Error("Bank account not found");

    const formatedBankDetails = {
      ...existingBankAccount,
      openingBalance: existingBankAccount.openingBalance.toNumber(),
    };

    return {
      success: true,
      message: "Bank account fetched successfully",
      data: formatedBankDetails,
    };
  } catch (error) {
    console.error("Error getting investments:", error.message);
    return {
      success: false,
      message: error.message || "Error during fetching bank account",
    };
  }
};

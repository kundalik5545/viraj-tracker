"use server";
import { prisma } from "@/db/db.config";
import { auth } from "@clerk/nextjs/server";

//Function to check newBalance change for Income, Expense, Transfer, Investment
const balanceChange = (data) => {
  if (!data || typeof data.amount !== "number") {
    throw new Error("Invalid data object or amount is not a number");
  }
  switch (data.type) {
    case "EXPENSE":
      return -data.amount;
    case "INCOME":
      return data.amount;
    // for transfer balance is negative
    case "TRANSFER":
      return -data.amount;
    case "INVESTMENT":
      return -data.amount;
    default:
      throw new Error(`Unsupported transaction type: ${data.type}`);
  }
};

export async function createTransaction(data) {
  try {
    // 1. Check if user exists and is logged in
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized User!");

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // 2. find bank account exist or not
    const mainAccount = await prisma.bankAccount.findUnique({
      where: { id: data.bankAccountId, userId: user.id },
    });

    if (!mainAccount) throw new Error("Bank Account not found");

    // 3. Calculate new balance change
    const newBalance =
      Number(mainAccount.openingBalance) + Number(balanceChange(data));

    // 4. Start Transactions
    const transaction = await prisma.$transaction(async (tx) => {
      //  Balance update logic for income, expense,Investment
      // Transaction 1: Create transaction for income, expense, investment
      if (data.type !== "TRANSFER") {
        const createdTransaction = await tx.transaction.create({
          data: {
            userId: user.id,
            bankAccountId: data.bankAccountId,
            type: data.type,
            category: data.category,
            amount: data.amount,
            date: data.date,
            description: data.description,
            status: data.status,
          },
        });

        if (!createdTransaction)
          throw new Error("Transaction creation failed", error);

        // Transaction 2: Update account balance for income, expense, investment
        const update_BankAccount_Balance = await tx.bankAccount.update({
          where: { id: data.bankAccountId, userId: user.id },
          data: {
            openingBalance: newBalance,
          },
        });
        if (!update_BankAccount_Balance)
          throw new Error("Bank account balance update failed");

        // Transaction 3: Create entery for new balance change in account balance.
        const create_AccountBalance_ChangeEntery =
          await tx.accountBalance.create({
            data: {
              userId: user.id,
              bankAccountId: data.bankAccountId,
              transactionId: createdTransaction.id,
              date: data.date,
              totalDeposite: data.type === "INCOME" ? data.amount : 0,
              totalWithdrawal: data.type !== "INCOME" ? data.amount : 0,
              totalBalance: newBalance, //totalBalance should be equal to openingBalance check by finding totalBalance and openingBalance
              description: data.description,
            },
          });

        if (!create_AccountBalance_ChangeEntery)
          throw new Error("Account balance update failed");
      } else {
        // Handle transfer type transaction
        // If transfer account id provoided => means transfer to self account and for other transfer such as family, friends etc. not provoided transfer account id
        if (data.transferAccountId) {
          // Transaction 4: Fetch transfer account details
          const transferAccount = await tx.bankAccount.findUnique({
            where: { id: data.transferAccountId, userId: user.id },
          });

          if (!transferAccount) throw new Error("Transfer account not found");

          // Update transfer account balance
          const newTransferAccountBalance =
            Number(transferAccount.openingBalance) -
            Number(balanceChange(data)); //balanceChange is negative

          // const newMainAccountBalance =
          //   Number(mainAccount.openingBalance) + Number(balanceChange(data)); //balanceChange is negative

          // Transaction 1: Create transaction for transfer account type for self.
          const create_Transaction_forMainAccount_TransferType_Self =
            await tx.transaction.create({
              data: {
                userId: user.id,
                bankAccountId: data.bankAccountId,
                type: data.type,
                category: data.category,
                amount: data.amount,
                date: data.date,
                description: data.description,
                status: data.status,
              },
            });

          if (!create_Transaction_forMainAccount_TransferType_Self)
            throw new Error("Transaction creation failed", error);

          // Transaction 1: Create transaction for transfer account type for self.
          const create_Transaction_forTransferAccount_TransferType_Self =
            await tx.transaction.create({
              data: {
                userId: user.id,
                bankAccountId: data.transferAccountId,
                type: data.type,
                category: data.category,
                amount: data.amount,
                date: data.date,
                description: `Self transfer from - ${mainAccount.bankName} to ${transferAccount.bankName} - userComment - ${data.description}}`,
                status: data.status,
              },
            });

          if (!create_Transaction_forTransferAccount_TransferType_Self)
            throw new Error("Transaction creation failed", error);

          // Transaction 5: Update transfer account bank balance
          const update_BankBalance_OfTransferAccount_WithTransferType_Self =
            await tx.bankAccount.update({
              where: { id: data.transferAccountId, userId: user.id },
              data: { openingBalance: newTransferAccountBalance },
            });

          if (!update_BankBalance_OfTransferAccount_WithTransferType_Self)
            throw new Error("Transfer account balance update failed");

          // Transaction 6: Update main account balance for transfer to self account transaction
          const update_BankBalance_OfMainAccount_WithTransferType_Self =
            await tx.bankAccount.update({
              where: { id: data.bankAccountId, userId: user.id },
              data: { openingBalance: newBalance },
            });

          if (!update_BankBalance_OfMainAccount_WithTransferType_Self)
            throw new Error("Main account balance update failed");

          // Transaction 6: Create new entry for transfer account in account balance for transfer to self account transaction
          const create_NewEntry_ForTransferAccount_InAccountBalance_ForTranseferType_Self =
            await tx.accountBalance.create({
              data: {
                userId: user.id,
                bankAccountId: data.transferAccountId,
                transactionId:
                  create_Transaction_forTransferAccount_TransferType_Self.id,
                date: data.date,
                totalDeposite: data.category === "SELF" ? data.amount : 0,
                totalWithdrawal: data.category !== "SELF" ? data.amount : 0,
                totalBalance: newTransferAccountBalance,
                description: `Self transfer from - ${mainAccount.bankName} to ${transferAccount.bankName} - userComment - ${data.description}}`,
              },
            });

          if (
            !create_NewEntry_ForTransferAccount_InAccountBalance_ForTranseferType_Self
          )
            throw new Error("New entry inside account balance failed");

          // 2. For main account
          const create_NewEntry_ForMainAccount_InAccountBalance_ForTranseferType_Self =
            await tx.accountBalance.create({
              data: {
                userId: user.id,
                bankAccountId: data.bankAccountId,
                transactionId:
                  create_Transaction_forMainAccount_TransferType_Self.id,
                date: data.date,
                totalDeposite: data.category !== "SELF" ? data.amount : 0,
                totalWithdrawal: data.category === "SELF" ? data.amount : 0,
                totalBalance: newBalance,
                description: data.description,
              },
            });

          if (
            !create_NewEntry_ForMainAccount_InAccountBalance_ForTranseferType_Self
          )
            throw new Error("New entry inside account balance failed");
        } else {
          // Transaction 1: Create transaction for transfer account type for others.
          const create_Transaction_ForTransferType_Other =
            await tx.transaction.create({
              data: {
                userId: user.id,
                bankAccountId: data.bankAccountId,
                type: data.type,
                category: data.category,
                amount: data.amount,
                date: data.date,
                description: data.description,
                status: data.status,
              },
            });

          if (!create_Transaction_ForTransferType_Other)
            throw new Error("Transaction creation failed", error);

          // Transaction 2: Update bank account balance for transfer type Other => only update main account balance and bank account balance
          // If no transfer account ID is provided, update only the main bank account balance
          const update_MainBankAccount_Balance = await tx.bankAccount.update({
            where: { id: data.bankAccountId, userId: user.id },
            data: { openingBalance: newBalance },
          });

          if (!update_MainBankAccount_Balance)
            throw new Error("Main account balance update failed");

          const create_NewEntry_InAccountBalance_ForMainAccount =
            await tx.accountBalance.create({
              data: {
                userId: user.id,
                bankAccountId: data.bankAccountId,
                transactionId: create_Transaction_ForTransferType_Other.id,
                date: data.date,
                totalDeposite: data.type === "INCOME" ? data.amount : 0,
                totalWithdrawal: data.type !== "INCOME" ? data.amount : 0,
                totalBalance: newBalance,
                description: data.description,
              },
            });

          if (!create_NewEntry_InAccountBalance_ForMainAccount)
            throw new Error("Main account balance update failed");
        }
      }
    });
  } catch (error) {
    console.log(error.message);
  }
}

// Get Transaction
export async function getTransaction(page = 1) {
  try {
    // 1. Check if user exists and is logged in
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized User!");

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // Paggination
    const pageSize = 10;

    // 2. Get all transactions with paggination

    const [totalRecords, transactions] = await prisma.$transaction(
      async (tx) => {
        const totalRecords = await tx.transaction.count({
          where: { userId: user.id },
        });
        const transactions = await tx.transaction.findMany({
          where: { userId: user.id },
          skip: (page - 1) * pageSize,
          take: pageSize,
          orderBy: { date: "desc" },
        });
        return [totalRecords, transactions];
      }
    );

    const totalPages = Math.ceil(totalRecords / pageSize);

    // const totalRecords = await prisma.transaction.count({
    //   where: { userId: user.id },
    // });

    // const transactions = await prisma.transaction.findMany({
    //   where: { userId: user.id },
    //   skip: (page - 1) * pageSize,
    //   take: pageSize,
    // });

    const formattedTransactions = transactions.map((transaction) => {
      return {
        ...transaction,
        amount: transaction.amount.toNumber(),
      };
    });

    return {
      success: true,
      message: "Transactions fetched successfully",
      data: {
        allTransactions: formattedTransactions,
        totalRecords,
        totalPages,
        currentPage: page,
      },
    };
  } catch (error) {
    console.log(error.message);
  }
}

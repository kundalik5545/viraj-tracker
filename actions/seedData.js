"use server";

import { prisma } from "@/db/db.config";
import { subDays } from "date-fns";

const userId = "ff1e3815-9074-4f80-af01-765616f4fcb1";
const accountId = "3972f9b5-456f-42cb-a8f7-450af955dca5";

// Categories with their typical amount ranges
const CATEGORIES = {
  INCOME: [
    { name: "salary", range: [50000, 80000] },
    { name: "freelance", range: [1000, 3000] },
    { name: "investments", range: [500, 2000] },
    { name: "other-income", range: [100, 1000] },
  ],
  EXPENSE: [
    { name: "housing", range: [1000, 2000] },
    { name: "transportation", range: [100, 500] },
    { name: "groceries", range: [200, 600] },
    { name: "utilities", range: [100, 300] },
    { name: "entertainment", range: [50, 200] },
    { name: "food", range: [50, 150] },
    { name: "shopping", range: [100, 500] },
    { name: "healthcare", range: [100, 1000] },
    { name: "education", range: [200, 1000] },
    { name: "travel", range: [500, 2000] },
  ],
};

// Helper to generate random amount within a range
function getRandomAmount(min, max) {
  return Number((Math.random() * (max - min) + min).toFixed(2));
}

// Helper to get random category with amount
function getRandomCategory(type) {
  const categories = CATEGORIES[type];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const amount = getRandomAmount(category.range[0], category.range[1]);
  return { category: category.name, amount };
}

export async function seedTransactions() {
  console.log("running seedTransactions");

  try {
    // Generate 90 days of transactions
    const transactions = [];
    let totalBalance = 0;

    console.log("running seedTransactions for loop");

    for (let i = 90; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const transactionsPerDay = Math.floor(Math.random() * 3) + 1;

      for (let j = 0; j < transactionsPerDay; j++) {
        const type = Math.random() < 0.1 ? "INCOME" : "EXPENSE";
        const { category, amount } = getRandomCategory(type);

        transactions.push({
          type,
          amount,
          description: `${
            type === "INCOME" ? "Received" : "Paid for"
          } ${category}`,
          date,
          category,
          status: "COMPLETED",
          userId,
          bankAccountId: accountId,
          createdAt: date,
          updatedAt: date,
        });

        totalBalance += type === "INCOME" ? amount : -amount;
      }
    }

    console.log("running seedTransactions for loop end");

    // Ensure transactions exist before inserting
    if (transactions.length === 0) {
      return { success: false, message: "No transactions to insert." };
    }

    console.log(
      "checking seedTransactions created or not- if this then created"
    );

    // try {
    //   const res = await prisma.transaction.deleteMany({
    //     where: { userId: userId, bankAccountId: accountId },
    //   });
    // } catch (error) {
    //   console.error("Error deleting transactions:", error);
    //   return { success: false, error: error.message };
    // }

    // console.log("running seedTransactions deleteMany", res);

    // Insert transactions in batches (Prisma `createMany` has a limit)
    const BATCH_SIZE = 100;

    for (let i = 0; i < transactions.length; i += BATCH_SIZE) {
      await prisma.transaction.createMany({
        data: transactions.slice(i, i + BATCH_SIZE),
      });
    }

    return {
      success: true,
      message: `Created ${transactions.length} transactions`,
    };
  } catch (error) {
    console.error("Error seeding transactions:", error);
    return { success: false, error: error.message };
  }
}

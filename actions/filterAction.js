"use server";
import { prisma } from "@/db/db.config";
import { auth } from "@clerk/nextjs/server";
import { skip } from "@prisma/client/runtime/library";

export async function getExpenseCategory(page = 1) {
  try {
    // 1. Check if user exists and is logged in
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized User!");

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // 2. Fetch all transactions of type EXPENSE
    const pageSize = 10;

    // const expenseCategory = await prisma.transaction.findMany({
    //   where: { userId: user.id, type: "EXPENSE" },
    //   skip: (page - 1) * pageSize,
    //   take: pageSize,
    // });

    const [totalRecords, expenseRecords] = await Promise.all([
      prisma.transaction.count({
        where: { userId: user.id, type: "EXPENSE" },
      }),
      prisma.transaction.findMany({
        where: { userId: user.id, type: "EXPENSE" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    const formattedAccounts = expenseRecords.map((account) => ({
      ...account,
      amount: account.amount.toNumber(),
    }));

    //4. Return the response
    return {
      success: true,
      message: "Bank accounts fetched successfully",
      data: {
        expenseRecords: formattedAccounts,
        totalRecords,
        currentPage: page,
      },
    };
  } catch (error) {}
}

"use server";
import { prisma } from "@/db/db.config";
import { auth } from "@clerk/nextjs/server";

export async function getExpenseTransactions(filterPeriodDays) {
  // let filterPeriodDays = 30;
  try {
    // 1. Check if user exists and is logged in
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized User!");

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // 2. Fetch all expense transactions for the given period
    const filterDates = new Date(
      new Date().setDate(new Date().getDate() - filterPeriodDays)
    );

    const expenseTransactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: filterDates,
          lt: new Date(),
        },
      },
    });

    // 3. Categorize transactions by type
    let incomeTransaction = [];
    let expenseTransaction = [];
    let investmentTransaction = [];
    let transferTransaction = [];

    expenseTransactions.forEach((transaction) => {
      switch (transaction.type) {
        case "INCOME":
          incomeTransaction.push(transaction);
          break;
        case "EXPENSE":
          expenseTransaction.push(transaction);
          break;
        case "INVESTMENT":
          investmentTransaction.push(transaction);
          break;
        case "TRANSFER":
          transferTransaction.push(transaction);
          break;
      }
    });

    // 3.1 Income transactions category-wise total amount
    const incomeWiseTransactions = incomeTransaction.reduce((acc, curr) => {
      // Parse the amount
      curr.amount = parseInt(curr.amount);

      // If the category does not exist in the accumulator, initialize it
      if (!acc[curr.category]) {
        acc[curr.category] = {
          amount: 0,
          categoryEmoji: getIncomeCategoryEmoji(curr.category.toLowerCase()),
        };
      }

      // Sum the amounts for each category
      acc[curr.category].amount += curr.amount;

      return acc;
    }, {});

    // Calculate total amount for Income transactions
    const totalIncomeAmount = Object.values(incomeWiseTransactions).reduce(
      (sum, { amount }) => sum + amount,
      0
    );

    // Generate final result with percentage for Income
    const incomeSummary = Object.keys(incomeWiseTransactions).map(
      (category) => {
        const categoryData = incomeWiseTransactions[category];
        return {
          type: category,
          category: categoryData.categoryEmoji,
          amount: categoryData.amount,
          percentage: ((categoryData.amount / totalIncomeAmount) * 100).toFixed(
            2
          ),
        };
      }
    );

    // 3.2 Expense transactions category-wise total amount
    const expenseWiseTransactions = expenseTransaction.reduce((acc, curr) => {
      curr.amount = parseInt(curr.amount);
      if (!acc[curr.category]) {
        acc[curr.category] = {
          amount: 0,
          categoryEmoji: getExpenseCategoryEmoji(curr.category.toLowerCase()),
        };
      }
      acc[curr.category].amount += curr.amount;
      return acc;
    }, {});

    console.log("expenseWiseTransactions: ", expenseWiseTransactions);

    const totalExpenseAmount = Object.values(expenseWiseTransactions).reduce(
      (sum, { amount }) => sum + amount,
      0
    );

    // Generate final result with percentage for Expense
    const expenseSummary = Object.keys(expenseWiseTransactions).map(
      (category) => {
        const categoryData = expenseWiseTransactions[category];
        return {
          type: category,
          category: categoryData.categoryEmoji,
          amount: categoryData.amount,
          percentage: (
            (categoryData.amount / totalExpenseAmount) *
            100
          ).toFixed(2),
        };
      }
    );

    // 3.3 Investment transactions category-wise total amount
    const investmentWiseTransactions = investmentTransaction.reduce(
      (acc, curr) => {
        curr.amount = parseInt(curr.amount);
        if (!acc[curr.category]) {
          acc[curr.category] = {
            amount: 0,
            categoryEmoji: getInvestmentCategoryEmoji(
              curr.category.toLowerCase()
            ),
          };
        }
        acc[curr.category].amount += curr.amount;
        return acc;
      },
      {}
    );

    const totalInvestmentAmount = Object.values(
      investmentWiseTransactions
    ).reduce((sum, { amount }) => sum + amount, 0);
    // Generate final result with percentage for Investment
    const investmentSummary = Object.keys(investmentWiseTransactions).map(
      (category) => {
        const categoryData = investmentWiseTransactions[category];
        return {
          type: category,
          category: categoryData.categoryEmoji,
          amount: categoryData.amount,
          percentage: (
            (categoryData.amount / totalInvestmentAmount) *
            100
          ).toFixed(2),
        };
      }
    );

    // 3.4 Transfer transactions category-wise total amount
    const transferWiseTransactions = transferTransaction.reduce((acc, curr) => {
      curr.amount = parseInt(curr.amount);
      if (!acc[curr.category]) {
        acc[curr.category] = {
          amount: 0,
          categoryEmoji: getTransferCategoryEmoji(curr.category.toLowerCase()),
        };
      }
      acc[curr.category].amount += curr.amount;
      return acc;
    }, {});

    const totalTransferAmount = Object.values(transferWiseTransactions).reduce(
      (sum, { amount }) => sum + amount,
      0
    );

    // Generate final result with percentage for Transfer
    const transferSummary = Object.keys(transferWiseTransactions).map(
      (category) => {
        const categoryData = transferWiseTransactions[category];
        return {
          type: category,
          category: categoryData.categoryEmoji,
          amount: categoryData.amount,
          percentage: (
            (categoryData.amount / totalTransferAmount) *
            100
          ).toFixed(2),
        };
      }
    );

    // Return the processed results
    return {
      incomeSummary,
      expenseSummary,
      investmentSummary,
      transferSummary,
      totalIncomeAmount,
      totalExpenseAmount,
      totalInvestmentAmount,
      totalTransferAmount,
      filterPeriodDays,
      filterDates,
    };
  } catch (error) {
    console.log("Error during getExpenseTransactions: ", error.message);
    return { error: error.message };
  }
}

// Helper function to return category emoji based on category name
function getIncomeCategoryEmoji(category) {
  const categoryEmojis = {
    salary: "💰 Salary",
    freelance: "💼 Freelance",
    loan: "🏦 Loan",
    gift: "🎁 Gift",
    passive: "📈 Passive Income",
    interest: "💹 Interest Earn",
    profit: "💸 Profit",
    others: "📦 Others",
    family: "👨‍👩‍👧‍👦 Family",
    food: "🍽️ Food",
    self: "🧘 Self",
  };

  return categoryEmojis[category] || category;
}
function getExpenseCategoryEmoji(category) {
  const categoryEmojis = {
    housing: "🏠 Housing",
    transportation: "🚗 Transportation",
    groceries: "🛒 Groceries",
    utilities: "💡 Utilities",
    entertainment: "🎬 Entertainment",
    food: "🍔 Food",
    shopping: "🛍️ Shopping",
    healthcare: "🏥 Healthcare",
    education: "📚 Education",
    personalCare: "💇 Personal Care",
    travel: "✈️ Travel",
    insurance: "🛡️ Insurance",
    giftsDonations: "🎁 Gifts & Donations",
    billsFees: "💳 Bills & Fees",
    otherExpenses: "📦 Other Expenses",
  };

  return categoryEmojis[category] || category;
}
function getInvestmentCategoryEmoji(category) {
  const categoryEmojis = {
    stocks: "📊 Stocks",
    nps: "🏛️ NPS",
    fd: "📅 FD",
    epf: "🏢 EPF",
    ppf: "🏦 PPF",
    "gold & silver": "🥇 Gold & Silver",
    "real estate": "🏠 Real Estate",
    bonds: "📜 Bonds",
    "mutual funds": "📈 Mutual Funds",
    others: "📦 Others",
  };

  return categoryEmojis[category] || category;
}
function getTransferCategoryEmoji(category) {
  const categoryEmojis = {
    self: "👤 Self",
    family: "👨‍👩‍👧‍👦 Family",
    friends: "👫 Friends",
    others: "📦 Others",
  };

  return categoryEmojis[category] || category;
}

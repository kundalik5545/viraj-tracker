import { z } from "zod";

// Add Bank Schema
export const bankAccountSchema = z.object({
  bankName: z.string().nonempty("Bank name required."),
  date: z.date(),
  openingBalance: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Amount must be greater than 0")
  ),
  isDefault: z.boolean(),
});

// Add Transaction Schema
export const addTransactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE", "TRANSFER", "INVESTMENT"]),
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().optional(),
  amount: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Amount must be greater than 0")
  ),
  date: z.date(),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["PENDING", "COMPLETED"]),
  bankAccountId: z.string().nonempty("Bank account id required."),
  transferAccountId: z.string().optional(),
});

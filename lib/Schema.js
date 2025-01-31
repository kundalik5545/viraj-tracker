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

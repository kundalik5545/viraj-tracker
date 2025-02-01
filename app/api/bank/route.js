import { getBankAccount } from "@/actions/bankAccount";

export async function GET() {
  const response = await getBankAccount();
  return Response.json({
    message: "Hello World!",
    success: true,
    result: response,
  });
}

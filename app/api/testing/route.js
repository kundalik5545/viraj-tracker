import { getExpenseTransactions } from "@/actions/dashboard";

export async function POST(data) {
  const response = await getExpenseTransactions(data);
  console.log(response);

  return Response.json({
    data: response,
    message: "Hello World!",
    success: true,
  });
}

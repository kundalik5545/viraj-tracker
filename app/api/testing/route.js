import { getExpenseCategory } from "@/actions/filterAction";

export async function GET() {
  const response = await getExpenseCategory();
  console.log(response);

  return Response.json({
    totalRecords: response.data.totalRecords,
    message: "Hello World!",
    success: true,
  });
}

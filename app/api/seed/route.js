import { seedTransactions } from "@/actions/seedData";

export async function GET() {
  const result = await seedTransactions();
  console.log(result);

  return new Response(JSON.stringify(result), {
    status: result.success ? 200 : 500,
    headers: { "Content-Type": "application/json" },
  });
}

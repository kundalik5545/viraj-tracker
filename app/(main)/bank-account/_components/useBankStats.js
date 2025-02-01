import { getBankBalance } from "@/actions/bankAccount";
import { useState, useEffect } from "react";

const useBankStats = () => {
  const [balance, setBalance] = useState({
    totalBalance: 0,
    totalExpense: 0,
    totalIncome: 0,
    totalRemaingBalance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await getBankBalance();
        console.log(typeof response.totalExpense);

        setBalance(response);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  return { balance, loading, error };
};

export default useBankStats;

import { getBankBalance } from "@/actions/bankAccount";
import { useState, useEffect } from "react";

const useBankStats = () => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const balanceData = await getBankBalance();
        setBalance(balanceData);
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

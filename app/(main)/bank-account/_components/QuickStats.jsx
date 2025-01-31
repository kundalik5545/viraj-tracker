import { formatCurrencyINR } from "@/lib/currencyFormatter";
import clsx from "clsx";
import React from "react";

const QuickStatCard = ({
  topTitle,
  MainAmt,
  iconName,
  statsChange,
  statTextColor,
  bgColor,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-neutral-200/30 shadow-md mb-1 sm:mb-5 mt-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-500 tracking-wider">{topTitle}</p>
          <h3 className="text-2xl font-bold text-neutral-800">
            {formatCurrencyINR(MainAmt)}
          </h3>
        </div>
        <div className={clsx("p-2 rounded-lg", `${bgColor}`)}>{iconName}</div>
      </div>
      <p className={clsx("mt-2 text-sm", `${statTextColor}`)}>{statsChange}</p>
    </div>
  );
};

export default QuickStatCard;

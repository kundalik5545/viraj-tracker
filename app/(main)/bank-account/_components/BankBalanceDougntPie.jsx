"use client";

import React, { useEffect, useRef } from "react";
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Import the plugin

// Register chart components and plugins
Chart.register(
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
  ChartDataLabels
);

const BankBalanceDoughnutChart = ({ balance }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");

    // Destroy previous chart instance if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Total Balance", "Income", "Expense", "Remaining Balance"],
        datasets: [
          {
            label: "Financial Summary",
            data: [
              Number(balance?.totalBalance) || 0,
              Number(balance?.totalIncome) || 0,
              Number(balance?.totalExpense) || 0,
              Number(balance?.totalRemaingBalance) || 0,
            ],
            backgroundColor: [
              "rgba(59, 130, 246, 0.7)",
              "rgba(16, 185, 129, 0.7)",
              "rgba(245, 158, 11, 0.7)",
              "rgba(139, 92, 246, 0.7)",
            ],
            borderColor: [
              "rgb(59, 130, 246)",
              "rgb(16, 185, 129)",
              "rgb(245, 158, 11)",
              "rgb(139, 92, 246)",
            ],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "bottom",
          },
          datalabels: {
            color: "#fff", // White text for better contrast
            font: {
              weight: "bold",
              size: 14,
            },
            formatter: (value) => value.toLocaleString(), // Formats numbers
          },
        },
      },
    });

    // Cleanup function to destroy chart on unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [balance]); // Re-run when `balance` updates

  return (
    <div style={{ position: "relative", height: "300px", width: "350px" }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default BankBalanceDoughnutChart;

"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,Legend } from "recharts";
function PofitLosData() {
  const profitLossData = [
    { date: "2025-01", revenue: 5000, expenses: 3000 },
    { date: "2025-02", revenue: 4500, expenses: 4800 },
    { date: "2025-03", revenue: 6000, expenses: 3500 },
    { date: "2025-04", revenue: 4000, expenses: 4200 },
  ];
  const dataWithProfit = profitLossData.map(item => ({
    ...item,
    profit: item.revenue - item.expenses
  }));

  return (
    <BarChart width={1000} height={300} data={dataWithProfit}>
      <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="revenue" fill="#4caf50" name="الإيرادات" />
      <Bar dataKey="expenses" fill="#f44336" name="المصاريف" />
      <Bar dataKey="profit" fill="#2196f3" name="الربح/الخسارة" />
    </BarChart>
  );
}

export default PofitLosData;


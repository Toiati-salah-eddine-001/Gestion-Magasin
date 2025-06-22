"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,Legend } from "recharts";
import { useEffect, useState } from "react";
import { reportsAPI } from "@/lib/api";

function PofitLosData() {
  const [profitLossData, setProfitLossData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const response = await reportsAPI.getProfitLossReport();
        // The backend returns monthly_trend as an array of { month, revenue, cost, profit }
        setProfitLossData(response.data.monthly_trend || []);
      } catch (err) {
        setError("Erreur lors du chargement des profits et pertes.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <BarChart width={1000} height={300} data={profitLossData}>
      <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="revenue" fill="#4caf50" name="الإيرادات" />
      <Bar dataKey="cost" fill="#f44336" name="المصاريف" />
      <Bar dataKey="profit" fill="#2196f3" name="الربح/الخسارة" />
    </BarChart>
  );
}

export default PofitLosData;


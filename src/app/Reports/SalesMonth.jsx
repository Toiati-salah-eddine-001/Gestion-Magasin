'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useEffect, useState } from "react";
import { reportsAPI } from "@/lib/api";

function SalesMonth() {
  const [monthlySales, setMonthlySales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const response = await reportsAPI.getSalesReport({ group_by: "month" });
        // The backend returns sales_over_time as an array of { period, sales_count, total_revenue }
        setMonthlySales(
          response.data.sales_over_time.map(item => ({
            month: item.period,
            sales: item.sales_count
          }))
        );
      } catch (err) {
        setError("Erreur lors du chargement des ventes.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <BarChart width={1000} height={300} data={monthlySales}>
      <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="sales" fill="#82ca9d" />
    </BarChart>
  );
}

export default SalesMonth;

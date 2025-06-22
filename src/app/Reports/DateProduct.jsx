"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";
import { reportsAPI } from "@/lib/api";

function DateProduct() {
  const [stockMovement, setStockMovement] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const response = await reportsAPI.getInventoryReport();
        // The backend returns stock_movement as an array
        setStockMovement(response.data.stock_movement || []);
      } catch (err) {
        setError("Erreur lors du chargement des mouvements de stock.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ background: '#fff', border: '1px solid #ccc', padding: 10 }}>
          <p><strong>Date :</strong> {label}</p>
          <p><strong>Produit :</strong> {data.name}</p>
          <p><strong>Stock actuel :</strong> {data.current_stock}</p>
          <p><strong>Quantité vendue :</strong> {data.sold_quantity}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <BarChart width={stockMovement.length<5?800:1000} height={300} data={stockMovement}>
      <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip content={<CustomTooltip/>} />
      <Legend />
      <Bar dataKey="current_stock" fill="#82ca9d" name="Stock actuel" />
      <Bar dataKey="sold_quantity" fill="#ff7f7f" name="Vendu (30j)" />
    </BarChart>
  );
}

export default DateProduct;

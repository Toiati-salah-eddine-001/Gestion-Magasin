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
function DateProduct() {
  const stockMovement = [
    { date: "2025-01-01", product: "حليب", in: 50, out: 20 },
    { date: "2025-01-02", product: "سكر", in: 100, out: 30 },
    { date: "2025-01-03", product: "زيت", in: 80, out: 60 },
    { date: "2025-01-04", product: "طحين", in: 70, out: 40 },
    { date: "2025-01-04", product: "طحين", in: 70, out: 40 },
    { date: "2025-01-04", product: "طحين", in: 70, out: 40 },
    { date: "2025-01-04", product: "طحين", in: 70, out: 40 },
    { date: "2025-01-04", product: "طحين", in: 70, out: 40 },
    { date: "2025-01-04", product: "طحين", in: 70, out: 40 },
    { date: "2025-01-04", product: "طحين", in: 70, out: 40 },
    { date: "2025-01-04", product: "طحين", in: 70, out: 40 },
    { date: "2025-01-04", product: "طحين", in: 70, out: 40 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ background: '#fff', border: '1px solid #ccc', padding: 10 }}>
          <p><strong>التاريخ:</strong> {label}</p>
          <p><strong>المنتوج:</strong> {data.product}</p>
          <p><strong>الكمية الداخلة:</strong> {data.in}</p>
          <p><strong>الكمية الخارجة:</strong> {data.out}</p>
        </div>
      );
    }
  
    return null;
  };
  
  return (
    <BarChart width={stockMovement.length<5?800:1000} height={300} data={stockMovement}>
      <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip content={<CustomTooltip/>} />
      <Legend />
      <Bar dataKey="in" fill="#82ca9d" name="الداخل" />
      <Bar dataKey="out" fill="#ff7f7f" name="الخارج" />
    </BarChart>
  );
}

export default DateProduct;

'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
function SalesMonth() {
    const monthlySales = [
        { month: 'يناير', sales: 1200 },
        { month: 'فبراير', sales: 950 },
        { month: 'مارس', sales: 1350 },
        { month: 'أبريل', sales: 800 },
        { month: 'ماي', sales: 1600 },
        { month: 'يونيو', sales: 1100 },
        { month: 'يوليوز', sales: 1450 },
        { month: 'غشت', sales: 900 },
        { month: 'شتنبر', sales: 1700 },
        { month: 'أكتوبر', sales: 1300 },
        { month: 'نونبر', sales: 1250 },
        { month: 'دجنبر', sales: 1800 },
      ];
      
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

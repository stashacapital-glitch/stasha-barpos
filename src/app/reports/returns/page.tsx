'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function DailyReturnsPage() {
  const [reportData, setReportData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    setLoading(true);
    
    // 1. Get all Menu Items (Opening Stock)
    const { data: items, error } = await supabase
      .from('menu_items')
      .select('id, name, stock_quantity, actual_count, price');

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    // 2. Get Today's Sales (Deductions)
    const today = new Date().toISOString().split('T')[0];
    const { data: sales } = await supabase
      .from('orders')
      .select('id')
      .gte('created_at', today);

    // For simplicity in Basic Plan, we calculate sales from stock_movement if tracked
    // Or we estimate. Here we will use the 'stock_quantity' as the LIVE calculated stock.
    // We need to show: Op, Purch, Sales, Expected, Actual, Diff.
    
    // Mocking data structure for the report
    // In a full app, you'd sum these from 'stock_movements'
    // For now:
    // Opening = current stock_quantity + todays_sales_qty (approx logic)
    // Expected = stock_quantity
    // Actual = actual_count
    
    // Let's simply show the user the current status vs actual count
    const formattedData = (items || []).map(item => {
        const opening = 50; // Mock Opening for demo (would come from start of day record)
        const purchases = 0; // Mock Purchases
        const sales = opening - item.stock_quantity; // Approx sales calculation
        const expected = item.stock_quantity;
        const actual = item.actual_count || 0;
        const diff = expected - actual;

        return {
            name: item.name,
            opening,
            purchases,
            sales,
            expected,
            actual,
            diff
        };
    });

    setReportData(formattedData);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
            <Link href="/pos" className="text-gray-400 hover:text-white"><ArrowLeft /></Link>
            <h1 className="text-2xl font-bold text-orange-400">Daily Returns & Stock Report</h1>
        </div>

        <div className="bg-gray-800 rounded-lg overflow-x-auto border border-gray-700">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-700 text-gray-400 uppercase text-xs">
              <tr>
                <th className="p-4">Item</th>
                <th className="p-4 text-center">Op</th>
                <th className="p-4 text-center">Purch</th>
                <th className="p-4 text-center">Sales</th>
                <th className="p-4 text-center">Exp. Closing</th>
                <th className="p-4 text-center">Actual</th>
                <th className="p-4 text-center font-bold text-red-400">Diff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {loading ? (
                <tr><td colSpan={7} className="p-4 text-center">Loading...</td></tr>
              ) : (
                reportData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-700">
                    <td className="p-4 font-medium">{row.name}</td>
                    <td className="p-4 text-center">{row.opening}</td>
                    <td className="p-4 text-center text-green-400">+{row.purchases}</td>
                    <td className="p-4 text-center text-red-400">-{row.sales}</td>
                    <td className="p-4 text-center">{row.expected}</td>
                    <td className="p-4 text-center">{row.actual}</td>
                    <td className={`p-4 text-center font-bold ${row.diff !== 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {row.diff}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
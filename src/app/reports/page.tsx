 'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase';
import Link from 'next/link';
import { ArrowLeft, Package, DollarSign, AlertTriangle } from 'lucide-react';

export default function ReportsPage() {
  const [sales, setSales] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // 1. Fetch Today's Sales (Mockup from orders table if exists, or local logic)
    // For now, we fetch inventory to calculate potential sales
    const { data: items } = await supabase
        .from('menu_items')
        .select('*');
    
    if (items) setInventory(items);

    // 2. In a real app, you would fetch from 'orders' table
    // const { data: orderData } = await supabase.from('orders').select('*').eq('date', today);
    
    setLoading(false);
  };

  // Manual Input for "Actual Counted Stock"
  const handleCountChange = async (itemId: string, count: number) => {
    // Update local state for immediate visual feedback
    setInventory(prev => prev.map(i => i.id === itemId ? {...i, actual_count: count} : i));
    
    // In a real scenario, you might save this to an 'inventory_log' table
    // await supabase.from('inventory_log').insert([{ item_id: itemId, type: 'count', quantity: count }]);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="flex items-center gap-4 mb-8">
            <Link href="/pos" className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-3xl font-bold text-orange-400">Reports & Inventory</h1>
        </div>

        {/* Tabs or Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* SECTION 1: DAILY SALES (Simplified) */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    <h2 className="text-xl font-bold">Daily Sales Summary</h2>
                </div>
                <p className="text-gray-400 text-sm mb-4">Calculated from orders placed today.</p>
                
                <div className="bg-gray-900 p-4 rounded">
                    <p className="text-sm text-gray-400">Total Sales (Today)</p>
                    <p className="text-3xl font-bold text-green-400">KES 0.00</p>
                    <p className="text-xs text-gray-500 mt-2">(Feature requires completed Orders table flow)</p>
                </div>
            </div>

            {/* SECTION 2: INVENTORY & RETURNS (The Formula) */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                    <Package className="w-5 h-5 text-blue-400" />
                    <h2 className="text-xl font-bold">Inventory & Stock Control</h2>
                </div>
                
                <table className="w-full text-xs">
                    <thead>
                        <tr className="text-gray-400 border-b border-gray-700">
                            <th className="pb-2 text-left">Item</th>
                            <th className="pb-2 text-center">Op</th>
                            <th className="pb-2 text-center">Purch</th>
                            <th className="pb-2 text-center">Sales</th>
                            <th className="pb-2 text-center">Exp</th>
                            <th className="pb-2 text-center">Actual</th>
                            <th className="pb-2 text-center">Diff</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {inventory.map((item) => {
                            const op = item.stock_quantity || 0; // Opening Stock (Current DB value)
                            const purch = 0; // TODO: Sum of purchases today
                            const sales = 0; // TODO: Count of sales today
                            const expected = op + purch - sales;
                            const actual = item.actual_count || 0; // User input
                            const diff = expected - actual;

                            return (
                                <tr key={item.id}>
                                    <td className="py-2 font-medium">{item.name}</td>
                                    <td className="py-2 text-center">{op}</td>
                                    <td className="py-2 text-center text-green-400">{purch}</td>
                                    <td className="py-2 text-center text-red-400">{sales}</td>
                                    <td className="py-2 text-center font-bold">{expected}</td>
                                    <td className="py-2 text-center">
                                        <input 
                                            type="number" 
                                            className="w-12 bg-gray-700 text-center rounded p-1"
                                            value={actual}
                                            onChange={(e) => handleCountChange(item.id, parseInt(e.target.value))}
                                        />
                                    </td>
                                    <td className={`py-2 text-center font-bold ${diff !== 0 ? 'text-red-400' : 'text-green-400'}`}>
                                        {diff}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div className="mt-4 text-right">
                     <button className="bg-orange-500 text-black font-bold px-4 py-2 rounded text-sm">
                         Save Stock Count
                     </button>
                </div>
            </div>

        </div>
    </div>
  );
}
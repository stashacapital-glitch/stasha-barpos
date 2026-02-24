 'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase';
import { Loader2 } from 'lucide-react';

export default function PosDashboard() {
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    
    // 1. Fetch Tables
    // FIX: Changed 'number' to 'table_number' to match your database column
    const { data: tableData, error: tableError } = await supabase
      .from('tables')
      .select('*')
      .order('table_number', { ascending: true });

    if (tableError) {
      console.error('Database error:', JSON.stringify(tableError, null, 2));
      setLoading(false);
      return;
    }

    // 2. Fetch Active Orders (Status 'open')
    const { data: ordersData } = await supabase
      .from('orders')
      .select('table_id, total_price')
      .eq('status', 'open');

    // 3. Map Totals to Tables
    const tablesWithTotals = (tableData || []).map(table => {
      const activeOrder = (ordersData || []).find(o => o.table_id === table.id);
      return {
        ...table,
        currentBill: activeOrder?.total_price || 0
      };
    });

    setTables(tablesWithTotals);
    setLoading(false);
  };

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white"><Loader2 className="animate-spin mr-2" /> Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-orange-400">Dashboard</h1>
          <p className="text-sm text-gray-500">Plan: Basic</p>
        </div>
        <div className="flex gap-3">
           <Link href="/reports/returns" className="text-sm bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
            Stock Reports
          </Link>
          <Link href="/admin/menu" className="text-sm bg-orange-500 text-black px-4 py-2 rounded font-bold hover:bg-orange-400">
            Manage Menu
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {tables.map((table) => (
          <Link 
            key={table.id} 
            href={`/table/${table.id}`}
            className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition border border-gray-700 hover:border-orange-500 text-center group flex flex-col justify-between min-h-[150px]"
          >
            <div>
              {/* FIX: Display table_number */}
              <h3 className="text-3xl font-bold mb-2 group-hover:text-orange-400 transition">
                {table.table_number}
              </h3>
              <span className={`text-xs px-2 py-1 rounded uppercase font-bold ${table.currentBill > 0 ? 'bg-red-600' : 'bg-green-600'}`}>
                {table.currentBill > 0 ? 'OCCUPIED' : 'OPEN'}
              </span>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-lg font-mono text-orange-400">
                KES {table.currentBill.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Current Bill</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
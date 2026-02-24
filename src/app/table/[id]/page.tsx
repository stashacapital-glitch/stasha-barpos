 'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

type OrderItem = { id: string; name: string; price: number; quantity: number };

export default function TableOrderPage() {
  const params = useParams();
  const router = useRouter();
  const tableId = params.id as string;

  const [tableNumber, setTableNumber] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [order, setOrder] = useState<OrderItem[]>([]);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const supabase = createClient();

  useEffect(() => {
    fetchTableDetails();
    fetchMenu();
    fetchActiveOrder();
  }, []);

  const fetchTableDetails = async () => {
    const { data } = await supabase.from('tables').select('number').eq('id', tableId).single();
    if (data) setTableNumber(data.number);
  };

  const fetchMenu = async () => {
    const { data } = await supabase.from('menu_items').select('*');
    setMenuItems(data || []);
    setLoading(false);
  };

  const fetchActiveOrder = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('table_id', tableId)
      .eq('status', 'open')
      .maybeSingle();

    if (data) {
      setOrderId(data.id);
      setOrder(data.items || []);
    }
  };

  const saveOrderToDB = async (currentOrder: OrderItem[]) => {
    try {
      const total = currentOrder.reduce((sum, item) => sum + item.price * item.quantity, 0);
      
      const orderData = {
        table_id: tableId,
        items: currentOrder,
        total_price: total,
        status: 'open',
      };

      let response;
      if (orderId) {
        response = await supabase.from('orders').update(orderData).eq('id', orderId);
      } else {
        response = await supabase.from('orders').insert([orderData]).select('id').single();
        if (response.data) setOrderId(response.data.id);
      }

      // IMPROVED ERROR LOGGING
      if (response && response.error) {
        console.error("=== DB SAVE FAILED ===");
        console.error("Error Object:", response.error);
        console.error("Error Message:", response.error.message);
        console.error("Error Details:", response.error.details);
        console.error("Error Hint:", response.error.hint);
        console.error("Error Code:", response.error.code);
        console.error("=====================");
        throw new Error(response.error.message || "Database permission error");
      }

    } catch (err: any) {
      console.error("Save failed:", err);
      toast.error(`Error: ${err.message}`);
    }
  };

  const addToOrder = (item: any) => {
    setOrder((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      let newOrder: OrderItem[];
      if (existing) {
        newOrder = prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      } else {
        newOrder = [...prev, { ...item, quantity: 1 }];
      }
      saveOrderToDB(newOrder);
      return newOrder;
    });
    toast.success(`${item.name} added`);
  };

  const removeFromOrder = (id: string) => {
    const newOrder = order.filter((i) => i.id !== id);
    setOrder(newOrder);
    saveOrderToDB(newOrder);
  };

  const total = order.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePayment = async () => {
    if (order.length === 0) return;
    await saveOrderToDB(order); 
    localStorage.setItem('receipt_data', JSON.stringify({ items: order, tableNumber: tableNumber || tableId, total }));
    router.push(`/table/${tableId}/pay`);
  };

  if (loading) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/pos')} className="text-gray-400 hover:text-white">
              <ArrowLeft />
            </button>
            <h1 className="text-2xl font-bold text-orange-400">Table {tableNumber || '...'}</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-950">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => addToOrder(item)}
                className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-left hover:border-orange-500 transition group"
              >
                <span className="text-3xl block mb-2">{item.emoji}</span>
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-orange-500 font-mono font-bold">KES {item.price}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-96 bg-gray-900 border-l border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold">Current Order</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {order.length === 0 ? (
            <p className="text-gray-600 text-center text-sm mt-10">No items</p>
          ) : (
            order.map((item) => (
              <div key={item.id} className="bg-gray-800 rounded-lg p-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.quantity} x {item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">KES {item.price * item.quantity}</span>
                  <button onClick={() => removeFromOrder(item.id)} className="text-red-500 text-xs">✕</button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-4 border-t border-gray-800">
          <div className="flex justify-between font-bold text-xl mb-4">
            <span>Total</span>
            <span className="text-orange-400">KES {total.toLocaleString()}</span>
          </div>
          <button onClick={handlePayment} disabled={order.length === 0} className="w-full bg-green-600 py-4 rounded-lg font-bold text-lg disabled:bg-gray-700">
            PAY
          </button>
        </div>
      </div>
    </div>
  );
}
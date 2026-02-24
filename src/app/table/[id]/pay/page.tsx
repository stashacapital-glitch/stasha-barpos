 'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase';
import { ArrowLeft, CreditCard, CheckCircle } from 'lucide-react';
import Receipt from '@/components/Receipt';

export default function PayPage() {
  const params = useParams();
  const router = useRouter();
  const tableId = params.id as string;
  
  const [items, setItems] = useState<any[]>([]);
  const [tableNumber, setTableNumber] = useState('');
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isProcessing, setIsProcessing] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const savedData = localStorage.getItem('receipt_data');
    
    if (savedData) {
        const data = JSON.parse(savedData);
        setItems(data.items || []);
        setTableNumber(data.tableNumber || tableId);
        setTotal(data.total || 0);
    }
    
    setLoading(false);
  }, [tableId]);

  const formatMoney = (amount: number) => {
    return amount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleConfirm = async () => {
    setIsProcessing(true);

    try {
      // 1. Update the order status to 'paid' in Supabase
      // This finds the open order for this table and closes it
      const { error } = await supabase
        .from('orders')
        .update({ 
            status: 'paid', 
            payment_method: paymentMethod,
            paid_at: new Date().toISOString() 
        })
        .eq('table_id', tableId)
        .eq('status', 'open'); // Target only the active draft

      if (error) {
        console.error("Payment update failed:", error);
        // Even if DB update fails, we proceed to clear local storage for UX
      }

      // 2. Clear local storage
      localStorage.removeItem('receipt_data');

      // 3. Redirect back to POS Dashboard
      router.push('/pos');

    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  if (loading) return <div className="p-8 text-white">Loading Payment...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 max-w-md mx-auto">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-white">
          <ArrowLeft />
        </button>
        <h1 className="text-xl font-bold">Payment: Table {tableNumber}</h1>
      </div>

      {/* On-Screen Receipt Preview */}
      <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-4 border border-gray-700 mb-6">
        <h2 className="text-lg font-bold mb-4 text-center text-gray-400">Receipt Preview</h2>
        
        <div className="bg-white text-black rounded overflow-hidden shadow-lg">
            <Receipt 
                items={items} 
                tableId={tableNumber} 
                total={total} 
                paymentMethod={paymentMethod}
                formatMoney={formatMoney}
            />
        </div>
      </div>

      <div className="max-w-md mx-auto space-y-3">
        {/* Payment Method Selection */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
            <h2 className="text-sm font-bold mb-3 text-gray-400">Payment Method</h2>
            <div className="grid grid-cols-2 gap-3">
                <button 
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-3 rounded-lg border-2 text-center font-bold text-sm transition ${paymentMethod === 'cash' ? 'border-orange-500 bg-orange-500/10 text-orange-400' : 'border-gray-700 text-gray-400'}`}
                >
                    Cash
                </button>
                <button 
                    onClick={() => setPaymentMethod('mpesa')}
                    className={`p-3 rounded-lg border-2 text-center font-bold text-sm transition ${paymentMethod === 'mpesa' ? 'border-orange-500 bg-orange-500/10 text-orange-400' : 'border-gray-700 text-gray-400'}`}
                >
                    M-Pesa
                </button>
            </div>
        </div>

        {/* Basic Plan Notice */}
        <div className="bg-blue-900 bg-opacity-20 border border-blue-700 text-blue-400 p-3 rounded text-xs text-center">
          Basic Plan: Printing is disabled. Upgrade to Pro for printed receipts.
        </div>

        {/* Confirm Button */}
        <button 
            onClick={handleConfirm} 
            disabled={isProcessing || items.length === 0} 
            className="w-full bg-green-600 hover:bg-green-500 disabled:bg-gray-700 text-white font-bold py-4 rounded-lg text-lg flex items-center justify-center gap-2 transition"
        >
            {isProcessing ? (
                "Processing..."
            ) : (
                <>
                    <CheckCircle className="w-6 h-6" />
                    Confirm Payment (KES {formatMoney(total)})
                </>
            )}
        </button>
      </div>
    </div>
  );
}
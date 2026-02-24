 import React from 'react';

type ReceiptItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type ReceiptProps = {
  items: ReceiptItem[];
  tableId: string | number;
  total: number;
  paymentMethod: string;
  businessName?: string;
  formatMoney: (amount: number) => string; // Add this prop
};

const Receipt = ({ items, tableId, total, paymentMethod, businessName = "Stasha Bar", formatMoney }: ReceiptProps) => {
  const currentDate = new Date().toLocaleString();

  return (
    <div className="bg-white text-black p-4 font-mono text-sm w-full max-w-xs mx-auto border border-dashed border-gray-400">
      {/* Header */}
      <div className="text-center border-b border-dashed border-gray-400 pb-2 mb-2">
        <h1 className="text-lg font-bold">{businessName}</h1>
        <p className="text-xs">Nairobi, Kenya</p>
        <p className="text-xs">Tel: +254 700 000 000</p>
      </div>

      {/* Meta Info */}
      <div className="flex justify-between text-xs mb-2">
        <span>Date: {currentDate}</span>
      </div>
      <div className="flex justify-between text-xs mb-2 border-b border-dashed border-gray-400 pb-2">
        <span>Table: {tableId}</span>
        <span>Method: {paymentMethod.toUpperCase()}</span>
      </div>

      {/* Items List */}
      <div className="border-b border-dashed border-gray-400 pb-2 mb-2">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between mb-1">
            <span className="w-1/2 truncate">{item.name}</span>
            <span className="w-1/4 text-center">x{item.quantity}</span>
            {/* Use the formatter here */}
            <span className="w-1/4 text-right">{formatMoney(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-b border-dashed border-gray-400 pb-2 mb-2">
        <div className="flex justify-between font-bold text-base">
          <span>TOTAL</span>
          {/* Use the formatter here */}
          <span>KES {formatMoney(total)}</span>
        </div>
        <p className="text-xs text-center mt-1">Inclusive of VAT</p>
      </div>

      {/* Footer */}
      <div className="text-center text-xs mt-4">
        <p>Thank you for your visit!</p>
        <p>Powered by StashaPOS</p>
      </div>
    </div>
  );
};

export default Receipt;
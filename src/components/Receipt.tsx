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
  paymentMethod?: string; // Made optional to prevent errors if missing
  businessName?: string;
  formatMoney?: (amount: number) => string; // Made optional
  // New props to fix the current build error:
  subTotal?: number;
  discount?: number;
  vat?: number;
  service?: number;
  date?: string;
};

const Receipt = ({
  items,
  tableId,
  total,
  paymentMethod = "N/A",
  businessName = "Stasha Bar",
  formatMoney = (amount) => amount.toFixed(2), // Default formatter if missing
  subTotal,
  discount,
  vat,
  service,
  date
}: ReceiptProps) => {
  
  const currentDate = date || new Date().toLocaleString();

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
            <span className="w-1/4 text-right">{formatMoney(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      {/* Totals - Updated to show breakdown */}
      <div className="border-b border-dashed border-gray-400 pb-2 mb-2 text-xs">
        
        {/* Show SubTotal if provided */}
        {subTotal !== undefined && (
          <div className="flex justify-between mb-1">
            <span>Sub Total</span>
            <span>KES {formatMoney(subTotal)}</span>
          </div>
        )}

        {/* Show Discount if provided */}
        {discount !== undefined && discount > 0 && (
          <div className="flex justify-between mb-1 text-red-600">
            <span>Discount</span>
            <span>- KES {formatMoney(discount)}</span>
          </div>
        )}

        {/* Show Service Charge if provided */}
        {service !== undefined && service > 0 && (
          <div className="flex justify-between mb-1">
            <span>Service Charge</span>
            <span>KES {formatMoney(service)}</span>
          </div>
        )}

        {/* Show VAT if provided */}
        {vat !== undefined && vat > 0 && (
          <div className="flex justify-between mb-1">
            <span>VAT</span>
            <span>KES {formatMoney(vat)}</span>
          </div>
        )}

        <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t border-dashed border-gray-300">
          <span>TOTAL</span>
          <span>KES {formatMoney(total)}</span>
        </div>
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
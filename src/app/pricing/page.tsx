'use client';

import { useState } from 'react';
import { plans, PlanConfig } from '@/utils/plans';
import { createClient } from '@/utils/supabase';
import toast from 'react-hot-toast';

export default function PricingPage() {
  const [loading, setLoading] = useState<PlanConfig | null>(null);
  const supabase = createClient();

  const handleSelectPlan = async (plan: PlanConfig) => {
    setLoading(plan);
    
    // Simulate selection logic (You would connect this to Stripe/M-Pesa later)
    // For now, we just update the user's preference in the database
    
    setTimeout(() => {
      toast.success(`Selected ${plan.name} plan! (Demo Mode)`);
      setLoading(null);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-extrabold text-orange-400 mb-4">Choose Your Plan</h1>
        <p className="text-gray-400 text-lg">Simple pricing. No hidden fees. Scale as you grow.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-2xl p-8 flex flex-col border ${
              plan.highlighted 
                ? 'bg-gray-800 border-orange-500 shadow-xl shadow-orange-500/10 scale-105 z-10' 
                : 'bg-gray-800 border-gray-700'
            }`}
          >
            {plan.highlighted && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase">
                  Best Value
                </span>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
              <p className="text-gray-400 text-sm mt-1">{plan.description}</p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="text-4xl font-extrabold text-white">KES {plan.monthlyPrice.toLocaleString()}</span>
                <span className="text-gray-400 ml-2">/ month</span>
              </div>
              
              {plan.trialDays > 0 ? (
                <p className="text-green-400 text-sm mt-2 font-medium">
                  ✅ Free for {plan.trialDays} Days
                </p>
              ) : (
                <p className="text-gray-500 text-sm mt-2">
                  Setup Fee: KES {plan.setupFee.toLocaleString()}
                </p>
              )}
            </div>

            <ul className="space-y-3 mb-8 text-sm flex-grow">
              {plan.features.map((feature, idx) => (
                <li key={idx} className={`flex items-center ${feature.included ? 'text-gray-300' : 'text-gray-600'}`}>
                  {feature.included ? (
                    <span className="text-green-400 mr-2">✓</span>
                  ) : (
                    <span className="text-gray-600 mr-2">✕</span>
                  )}
                  {feature.text}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSelectPlan(plan)}
              disabled={loading !== null}
              className={`w-full py-3 rounded-lg font-bold transition-all ${
                plan.highlighted
                  ? 'bg-orange-500 hover:bg-orange-600 text-black'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              } ${loading === plan ? 'opacity-50' : ''}`}
            >
              {loading === plan ? 'Processing...' : 'Select Plan'}
            </button>
          </div>
        ))}
      </div>
      
      {/* Extras Section */}
      <div className="max-w-4xl mx-auto mt-16 text-center border-t border-gray-700 pt-10">
        <h2 className="text-2xl font-bold text-white mb-6">Optional Add-ons</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
             <h4 className="font-bold text-orange-400">On-Site Training</h4>
             <p className="text-gray-400 text-sm mt-1">KES 5,000 / session</p>
           </div>
           <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
             <h4 className="font-bold text-orange-400">Hardware Setup</h4>
             <p className="text-gray-400 text-sm mt-1">KES 3,000 (Printers/Scanners)</p>
           </div>
           <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
             <h4 className="font-bold text-orange-400">Custom Menu Design</h4>
             <p className="text-gray-400 text-sm mt-1">KES 2,500</p>
           </div>
        </div>
      </div>

    </div>
  );
}
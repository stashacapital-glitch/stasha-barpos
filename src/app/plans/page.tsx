 'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase'; // FIX: Corrected import path
import { Check, Star, Zap, Loader2 } from 'lucide-react';

export default function PlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const supabase = createClient();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .order('price_monthly', { ascending: true });

    if (error) {
      console.error('Error fetching plans:', error);
    } else {
      setPlans(data || []);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8 flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex-grow">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-orange-400 mb-2 tracking-tight">
            Stasha Bar POS
          </h1>
          <p className="text-xl text-gray-300 mb-6">Select your plan to begin</p>

          <div className="inline-flex items-center bg-gray-800 rounded-full p-1 border border-gray-700">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition ${
                billingCycle === 'monthly' ? 'bg-orange-500 text-black' : 'text-gray-400'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition ${
                billingCycle === 'yearly' ? 'bg-orange-500 text-black' : 'text-gray-400'
              }`}
            >
              Yearly <span className="text-xs text-green-400">(Save 15%)</span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-6 flex flex-col ${
                  plan.highlight 
                    ? 'bg-gray-800 border-2 border-orange-500 shadow-xl shadow-orange-500/20 transform scale-105 z-10' 
                    : 'bg-gray-800 border border-gray-700'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" /> RECOMMENDED
                    </span>
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className="text-gray-400 text-sm mt-1">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-lg text-gray-400">KES</span>
                    <span className="text-4xl font-bold text-white ml-1">
                      {billingCycle === 'monthly' ? plan.price_monthly.toLocaleString() : plan.price_yearly.toLocaleString()}
                    </span>
                    <span className="text-gray-500 text-sm ml-2">/mo</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature: string) => (
                    <li key={feature} className="flex items-start text-sm text-gray-300">
                      <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href="/pos" className="w-full">
                  <button
                    className={`w-full py-3 rounded-lg font-bold text-sm transition ${
                      plan.highlight
                        ? 'bg-orange-500 text-black hover:bg-orange-600'
                        : 'bg-gray-700 text-white hover:bg-gray-600 border border-gray-600'
                    }`}
                  >
                    Start Free Trial
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Automation CTA */}
        <div className="text-center bg-gray-800 border border-gray-700 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-orange-400" />
              <span className="text-lg font-medium text-white">
                If you want your business automated
              </span>
            </div>
            <a 
              href="https://wa.me/254700000000?text=Hi%20StashaPOS%2C%20I%20need%20automation%20services." 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-full font-bold text-sm transition"
            >
              Contact Us
            </a>
          </div>
        </div>

      </div>

      <div className="text-center py-6 border-t border-gray-800 mt-auto">
        <p className="text-gray-500 text-sm font-medium tracking-wide">
          Powered by <span className="text-orange-400 font-bold">StashaPOS</span>
        </p>
      </div>
    </div>
  );
}
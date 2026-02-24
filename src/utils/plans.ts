 export type PlanType = 'basic' | 'pro' | 'enterprise';

export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface PlanConfig {
  id: PlanType;
  name: string;
  description: string;
  monthlyPrice: number; // In KES
  setupFee: number; // In KES
  trialDays: number;
  features: PlanFeature[];
  highlighted?: boolean;
}

export const plans: PlanConfig[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Perfect for small bars and startups.',
    monthlyPrice: 1500, // KES 1,500
    setupFee: 0, // Free Setup
    trialDays: 14, // 14 Days Free
    features: [
      { text: '1 Staff Account', included: true },
      { text: 'Up to 10 Tables', included: true },
      { text: 'Basic Sales Reports', included: true },
      { text: 'Menu Management', included: true },
      { text: 'Inventory Tracking', included: false },
      { text: 'M-Pesa Integration', included: false },
      { text: 'Priority Support', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For growing bars that need efficiency.',
    monthlyPrice: 5500, // KES 5,500
    setupFee: 3000, // KES 3,000 (Training & Setup)
    trialDays: 0,
    highlighted: true, // Highlight this as "Best Value"
    features: [
      { text: '10 Staff Accounts', included: true },
      { text: 'Up to 30 Tables', included: true },
      { text: 'Advanced Reports & Analytics', included: true },
      { text: 'Menu Management', included: true },
      { text: 'Inventory Tracking', included: true },
      { text: 'M-Pesa Integration', included: true },
      { text: 'Priority Support', included: false },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For clubs, lounges, and multiple branches.',
    monthlyPrice: 15000, // KES 15,000
    setupFee: 15000, // KES 15,000 (On-site Training & Hardware Setup)
    trialDays: 0,
    features: [
      { text: 'Unlimited Staff Accounts', included: true },
      { text: 'Unlimited Tables', included: true },
      { text: 'Multi-Branch Support', included: true },
      { text: 'Custom Menu & Layouts', included: true },
      { text: 'Full Inventory System', included: true },
      { text: 'M-Pesa & Bank Integration', included: true },
      { text: 'Dedicated Account Manager', included: true },
    ],
  },
];

export const getPlanConfig = (planId: PlanType): PlanConfig | undefined => {
  return plans.find(p => p.id === planId);
};
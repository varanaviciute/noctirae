export interface Profile {
  id: string;
  email: string;
  is_premium: boolean;
  stripe_customer_id: string | null;
  streak_count: number;
  last_logged_date: string | null;
  created_at: string;
}

export interface DreamInterpretation {
  summary: string;
  psychological: string;
  esoteric: string;
  symbols: Array<{ symbol: string; meaning: string }>;
  // Premium only
  insights?: string | null;
  reflections?: string[] | null;
  recommendations?: string[] | null;
}

export interface Dream {
  id: string;
  user_id: string;
  content: string;
  title: string;
  interpretation: DreamInterpretation;
  symbols: string[];
  emotions: string[];
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  status: "active" | "canceled" | "past_due" | "trialing";
  current_period_end: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  dreamData?: DreamInterpretation;
  timestamp: Date;
}

export interface InsightPattern {
  type: "symbol" | "emotion" | "theme";
  value: string;
  count: number;
  lastSeen: string;
  message: string;
}

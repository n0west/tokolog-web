export interface ExpenseData {
  id?: number;
  user_id: string;
  description: string;
  amount: number;
  discount_amount: number; // おトクの場合
  passed_amount: number;   // ガマンの場合
  category_id: number;
  expense_date: string;
  created_at: string;
  updated_at: string;
}

export interface StatsData {
  otokuTotal: number;
  gamanTotal: number;
  otokuComparison: number; // 先月比
  gamanComparison: number; // 先月比
}

export interface RecordData {
  id: string;
  type: 'otoku' | 'gaman';
  amount: number;
  date: string;
  productName: string;
  created_at?: string;
}

export interface FormData {
  productName: string;
  amount: number;
  originalAmount?: number;
  discountAmount?: number;
  calculationMethod?: string;
  gamanReason?: string;
  memo?: string;
}

export interface ManualInputPageProps {
  type: 'otoku' | 'gaman';
  onBack: () => void;
  onSubmit: (data: FormData) => void;
  isSubmitting?: boolean;
}
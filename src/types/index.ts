export interface Expense {
  id: string;
  amount: number;
  category: string;
  subcategory: string;
  categoryId: string;
  paymentMethod: string;
  description?: string;
  timestamp: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  expense?: Expense;
  timestamp: Date;
}

export interface ParsedExpense {
  amount: number;
  category: string;
  subcategory: string;
  categoryId: string;
  paymentMethod: string;
  description?: string;
  timestamp?: string;
}

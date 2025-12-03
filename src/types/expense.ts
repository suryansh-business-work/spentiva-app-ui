/**
 * Expense-related type definitions
 * Based on the backend API response structure
 */

/**
 * Expense object as returned by the API
 */
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

/**
 * API response when creating an expense
 */
export interface ExpenseResponse {
  message: string;
  data: {
    expense: Expense;
  };
  status: 'success' | 'error';
  statusCode: number;
}

/**
 * Parsed expense data from the AI parsing endpoint
 */
export interface ParsedExpense {
  amount: number;
  category: string;
  subcategory: string;
  categoryId: string;
  paymentMethod: string;
  description?: string;
  error?: string;
}

/**
 * Expense data to be sent when creating
 */
export interface CreateExpenseData {
  trackerId: string;
  amount: number;
  category: string;
  subcategory: string;
  categoryId: string;
  paymentMethod: string;
  description?: string;
}

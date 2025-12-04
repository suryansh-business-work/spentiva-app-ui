import { useState, useEffect, useCallback } from 'react';
import { endpoints } from '../../../config/api';
import { getRequest, postRequest } from '../../../utils/http';
import { ParsedExpense, CreateExpenseData, Expense } from '../../../types/expense';

/**
 * Category structure
 */
interface Category {
  _id: string;
  trackerId: string;
  name: string;
  subcategories: Array<{ id: string; name: string }>;
}

/**
 * Custom hook to handle expense-related actions
 */
export const useExpenseActions = (trackerId?: string) => {
  const [categories, setCategories] = useState<Category[]>([]);

  /**
   * Load categories for the current tracker
   */
  const loadCategories = useCallback(async () => {
    if (!trackerId) return;

    try {
      const response = await getRequest(endpoints.categories.getAll(trackerId));
      const data = response.data?.data?.categories || [];
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }, [trackerId]);

  /**
   * Parse expense from natural language input
   */
  const parseExpense = useCallback(
    async (input: string): Promise<ParsedExpense> => {
      try {
        const response = await postRequest(endpoints.expenses.parse, {
          input,
          trackerId,
        });

        return response.data?.data || response.data;
      } catch (error: any) {
        console.error('Error parsing expense:', error);

        // Check if error is related to category parsing
        // API returns: { data: { error: "message about category" } }
        const apiError = error.response?.data?.data?.error || error.response?.data?.error || '';
        const errorMessage = error.response?.data?.message || error.message || '';

        if (
          apiError.toLowerCase().includes('category') ||
          errorMessage.toLowerCase().includes('category')
        ) {
          throw new Error(
            `CATEGORY_ERROR:: Please ensure the payment method (cash, card, etc.) is included in the user message. Use only existing categories. To add a new one, <a href="/tracker/${trackerId}/settings" style="color: #14B8A6; text-decoration: underline; cursor: pointer;">click here</a>.`
          );
        }

        throw new Error(errorMessage || 'Failed to parse expense');
      }
    },
    [trackerId]
  );

  /**
   * Create a new expense
   */
  const createExpense = useCallback(
    async (parsedData: ParsedExpense): Promise<Expense> => {
      if (!trackerId) {
        throw new Error('Tracker ID is required');
      }

      const expenseData: CreateExpenseData = {
        ...parsedData,
        trackerId,
      };

      try {
        const response = await postRequest(endpoints.expenses.create, expenseData);
        const expense = response.data?.data?.expense || response.data?.expense;

        if (!expense) {
          throw new Error('Invalid response from server');
        }

        return expense;
      } catch (error) {
        console.error('Error creating expense:', error);
        throw new Error('Failed to create expense');
      }
    },
    [trackerId]
  );

  /**
   * Load categories on mount and when tracker changes
   */
  useEffect(() => {
    if (trackerId) {
      loadCategories();
    }

    const handleCategoriesUpdate = () => {
      if (trackerId) {
        loadCategories();
      }
    };

    window.addEventListener('categoriesUpdated', handleCategoriesUpdate);
    return () => {
      window.removeEventListener('categoriesUpdated', handleCategoriesUpdate);
    };
  }, [trackerId, loadCategories]);

  return {
    categories,
    parseExpense,
    createExpense,
    loadCategories,
  };
};

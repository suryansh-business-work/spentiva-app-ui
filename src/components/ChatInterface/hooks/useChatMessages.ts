import { useState, useCallback } from 'react';
import { Message } from '../../../types';

/**
 * Usage data structure stored in localStorage
 */
interface UsageData {
  totalMessages: number;
  trackerUsage: Record<string, number>;
  currentMonth: string;
}

/**
 * Subscription plans and their limits
 */
const SUBSCRIPTION_LIMITS: Record<string, number> = {
  Free: 50,
  Pro: 500,
  Business: 2000,
};

/**
 * Custom hook to manage chat message state and usage tracking
 */
export const useChatMessages = (_trackerId: string | undefined) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Hi! I'm your expense tracker assistant. Tell me about your expenses naturally, like 'spend food 50 from credit card' or 'bought groceries 200 cash'.",
      timestamp: new Date(),
    },
  ]);

  /**
   * Track message usage in localStorage
   */
  const trackMessageUsage = useCallback((trackerId?: string): UsageData => {
    const storedUsage = localStorage.getItem('usage_data');
    const currentMonth = new Date().toISOString().slice(0, 7);

    let usageData: UsageData = storedUsage
      ? JSON.parse(storedUsage)
      : {
          totalMessages: 0,
          trackerUsage: {},
          currentMonth,
        };

    // Reset if new month
    if (usageData.currentMonth !== currentMonth) {
      usageData = {
        totalMessages: 0,
        trackerUsage: {},
        currentMonth,
      };
    }

    // Increment total messages
    usageData.totalMessages += 1;

    // Increment tracker-specific usage
    if (trackerId) {
      usageData.trackerUsage[trackerId] = (usageData.trackerUsage[trackerId] || 0) + 1;
    }

    // Save to localStorage
    localStorage.setItem('usage_data', JSON.stringify(usageData));

    return usageData;
  }, []);

  /**
   * Check if user has reached their usage limit
   */
  const checkUsageLimit = useCallback((): boolean => {
    const storedUsage = localStorage.getItem('usage_data');
    const storedPlan = localStorage.getItem('subscription_plan') || 'Free';

    const currentLimit = SUBSCRIPTION_LIMITS[storedPlan] || SUBSCRIPTION_LIMITS.Free;

    if (storedUsage) {
      const usageData: UsageData = JSON.parse(storedUsage);
      const currentMonth = new Date().toISOString().slice(0, 7);

      // Reset if new month
      if (usageData.currentMonth !== currentMonth) {
        return true; // Allow message in new month
      }

      return usageData.totalMessages < currentLimit;
    }

    return true; // First message
  }, []);

  /**
   * Add a new message to the chat
   */
  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  /**
   * Add a user message
   */
  const addUserMessage = useCallback(
    (content: string): Message => {
      const message: Message = {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: new Date(),
      };
      addMessage(message);
      return message;
    },
    [addMessage]
  );

  /**
   * Add an assistant message
   */
  const addAssistantMessage = useCallback(
    (content: string, expense?: any): Message => {
      const message: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content,
        expense,
        timestamp: new Date(),
      };
      addMessage(message);
      return message;
    },
    [addMessage]
  );

  return {
    messages,
    setMessages,
    addMessage,
    addUserMessage,
    addAssistantMessage,
    trackMessageUsage,
    checkUsageLimit,
  };
};

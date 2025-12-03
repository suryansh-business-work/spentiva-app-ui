import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { notifyExpenseAdded } from '../../services/notificationService';
import { useChatMessages } from './hooks/useChatMessages';
import { useExpenseActions } from './hooks/useExpenseActions';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import LoadingSkeleton from './components/LoadingSkeleton';
import './ChatInterface.scss';

/**
 * Props for ChatInterface component
 */
interface ChatInterfaceProps {
  onExpenseAdded?: () => void;
  trackerId?: string;
}

/**
 * ChatInterface Component
 * Main chat interface for expense tracking with AI assistance
 */
const ChatInterface: React.FC<ChatInterfaceProps> = ({ onExpenseAdded, trackerId }) => {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Custom hooks
  const {
    messages,
    addUserMessage,
    addAssistantMessage,
    trackMessageUsage,
    checkUsageLimit,
  } = useChatMessages(trackerId);

  const { parseExpense, createExpense } = useExpenseActions(trackerId);

  /**
   * Get user profile photo URL
   */
  const getUserPhotoUrl = (): string => {
    if (user?.profilePhoto) {
      return user.profilePhoto.startsWith('http')
        ? user.profilePhoto
        : `https://api.spentiva.com${user.profilePhoto}`;
    }
    return '';
  };

  /**
   * Scroll to bottom of messages
   */
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  /**
   * Handle message submission
   */
  const handleSubmit = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    // Check usage limit before processing
    if (!checkUsageLimit()) {
      addAssistantMessage(
        "⚠️ You've reached your monthly message limit. Please upgrade your subscription plan to continue using AI features. Visit the Usage page to see available plans."
      );
      return;
    }

    // Add user message
    addUserMessage(input);
    setInput('');
    setIsLoading(true);

    try {
      // Track message usage
      trackMessageUsage(trackerId);

      // Parse the expense using AI
      const parsed = await parseExpense(input);

      if (parsed.error) {
        addAssistantMessage(parsed.error);
      } else {
        // Create the expense
        const expense = await createExpense(parsed);

        // Add success message with expense details
        addAssistantMessage(
          `✅ Expense logged successfully!\n\nAmount: ₹${expense.amount}\nCategory: ${expense.subcategory}\nPayment: ${expense.paymentMethod}`,
          expense
        );

        // Notify parent component
        if (onExpenseAdded) {
          onExpenseAdded();
        }

        // Show system notification
        notifyExpenseAdded(expense.amount, expense.subcategory);

        // Dispatch event for other components
        window.dispatchEvent(new Event('expenseUpdated'));
      }
    } catch (error: any) {
      console.error('Error processing expense:', error);
      addAssistantMessage(
        error.message || 'Sorry, I encountered an error. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    input,
    isLoading,
    trackerId,
    checkUsageLimit,
    addUserMessage,
    addAssistantMessage,
    trackMessageUsage,
    parseExpense,
    createExpense,
    onExpenseAdded,
  ]);

  /**
   * Auto-scroll when messages update
   */
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100% - 300px)',
        px: 2,
        py: 1.5,
      }}
    >
      {/* Messages Container */}
      <Box
        className="chat-messages"
        sx={{
          flexGrow: 1,
          minHeight: 'calc(100vh - 320px)',
          overflowY: 'auto',
          overflowX: 'hidden',
          mb: 2,
          pr: 1,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(0,0,0,0.05)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(16, 185, 129, 0.3)',
            borderRadius: '4px',
            '&:hover': {
              background: 'rgba(16, 185, 129, 0.5)',
            },
          },
        }}
      >
        {/* Render Messages */}
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            userPhotoUrl={getUserPhotoUrl()}
            userName={user?.name}
          />
        ))}

        {/* Loading Indicator */}
        {isLoading && <LoadingSkeleton />}

        {/* Scroll Anchor */}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Form */}
      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        disabled={isLoading}
      />
    </Box>
  );
};

export default ChatInterface;

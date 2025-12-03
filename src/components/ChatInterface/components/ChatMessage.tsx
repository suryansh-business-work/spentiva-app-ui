import React from 'react';
import { Box, Avatar, Paper, Typography } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { Message } from '../../../types';
import ExpenseCard from './ExpenseCard';

/**
 * Props for ChatMessage component
 */
interface ChatMessageProps {
  message: Message;
  userPhotoUrl?: string;
  userName?: string;
}

/**
 * ChatMessage Component
 * Displays a single chat message with avatar and content
 */
const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  userPhotoUrl,
  userName
}) => {
  const isUser = message.role === 'user';

  /**
   * Get avatar content based on message role
   */
  const getAvatarContent = () => {
    if (isUser) {
      if (userName) {
        return userName.charAt(0).toUpperCase();
      }
      return <PersonIcon />;
    }
    return <SmartToyIcon />;
  };

  return (
    <Box
      className={`message ${message.role}`}
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 2,
        gap: 1.5,
        flexDirection: isUser ? 'row-reverse' : 'row',
      }}
    >
      {/* Avatar */}
      <Avatar
        src={isUser ? userPhotoUrl : undefined}
        sx={{
          width: 40,
          height: 40,
          background: isUser
            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          flexShrink: 0,
        }}
      >
        {getAvatarContent()}
      </Avatar>

      {/* Message Content */}
      <Paper
        elevation={2}
        sx={{
          p: 1.5,
          maxWidth: '75%',
          backgroundColor: isUser ? '#10b981' : '#fff',
          color: isUser ? '#fff' : '#333',
          borderRadius: 2,
        }}
      >
        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
          {message.content}
        </Typography>

        {/* Expense Card (if expense data is present) */}
        {message.expense && <ExpenseCard expense={message.expense} />}
      </Paper>
    </Box>
  );
};

export default ChatMessage;

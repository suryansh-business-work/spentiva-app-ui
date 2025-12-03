import React from 'react';
import { Box, Avatar, Paper, Typography, useTheme } from '@mui/material';
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
const ChatMessage: React.FC<ChatMessageProps> = ({ message, userPhotoUrl, userName }) => {
  const isUser = message.role === 'user';
  const theme = useTheme();

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

  // Check if message contains HTML (for category error links)
  const hasHtmlLink = message.content.includes('<a href=');
  const displayContent = hasHtmlLink ? message.content.replace('CATEGORY_ERROR::', '') : message.content;

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
            ? `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`
            : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          flexShrink: 0,
        }}
      >
        {getAvatarContent()}
      </Avatar>

      {/* Message Content */}
      <Paper
        sx={{
          p: 1.5,
          maxWidth: '75%',
          backgroundColor: isUser ? theme.palette.success.main : theme.palette.background.paper,
          color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
          borderRadius: 1,
        }}
      >
        {hasHtmlLink ? (
          <Typography
            variant="body1"
            sx={{
              whiteSpace: 'pre-line',
              '& a': {
                color: theme.palette.primary.main,
                textDecoration: 'underline',
                cursor: 'pointer',
              },
            }}
            dangerouslySetInnerHTML={{ __html: displayContent }}
          />
        ) : (
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
            {message.content}
          </Typography>
        )}

        {/* Expense Card (if expense data is present) */}
        {message.expense && <ExpenseCard expense={message.expense} />}
      </Paper>
    </Box>
  );
};

export default ChatMessage;

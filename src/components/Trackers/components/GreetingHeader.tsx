import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import TypingAnimation from '../../common/TypingAnimation';

/**
 * GreetingHeader Component
 * Displays personalized greeting with typing animation
 */
const GreetingHeader: React.FC = () => {
  const [greeting, setGreeting] = useState('');
  const [userName, setUserName] = useState('User');
  const [showTyping, setShowTyping] = useState(false);

  const messages = [
    'How are you? Hope you are great!',
    'I hope you spend wisely today',
    "Let's track your expenses efficiently",
    'Managing money made simple',
  ];

  const [currentMessage] = useState(
    messages[Math.floor(Math.random() * messages.length)]
  );

  useEffect(() => {
    // Get user from localStorage
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserName(user.name || user.email?.split('@')[0] || 'User');
      }
    } catch (error) {
      console.error('Error reading user from localStorage:', error);
    }

    // Set greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good morning');
    } else if (hour < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }

    // Show typing animation after a brief delay
    const timer = setTimeout(() => setShowTyping(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: 'text.primary',
          fontSize: { xs: '1.5rem', md: '1.75rem' },
          mb: 0.5,
        }}
      >
        {greeting}, {userName}! 👋
      </Typography>
      <Box sx={{ minHeight: 24 }}>
        {showTyping && (
          <TypingAnimation
            text={currentMessage}
            speed={40}
            delay={100}
            variant="body2"
            color="text.secondary"
          />
        )}
      </Box>
    </Box>
  );
};

export default GreetingHeader;

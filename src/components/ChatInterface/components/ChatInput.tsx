import React from 'react';
import { Box, TextField, Button, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

/**
 * Props for ChatInput component
 */
interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
}

/**
 * ChatInput Component
 * Input form for sending chat messages
 */
const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = "Type your expense... (e.g., 'spend food 50 from credit card')",
}) => {
  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSubmit();
  };

  return (
    <Paper elevation={3} sx={{ p: 2, position: 'sticky', bottom: 0 }}>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* Input Field */}
          <TextField
            fullWidth
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            variant="outlined"
            size="medium"
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            disabled={disabled || !value.trim()}
            endIcon={<SendIcon />}
            sx={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              minWidth: '120px',
            }}
          >
            Send
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default ChatInput;

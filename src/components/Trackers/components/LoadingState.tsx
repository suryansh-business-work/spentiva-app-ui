import React from 'react';
import { Box, Skeleton, Fade } from '@mui/material';
import { useTheme } from '@mui/material';

interface LoadingStateProps {
  count?: number;
}

const LoadingState: React.FC<LoadingStateProps> = ({ count = 4 }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
        gap: 3,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Fade in={true} timeout={300 * (i + 1)} key={i}>
          <Box>
            <Skeleton
              variant="rectangular"
              height={220}
              sx={{
                borderRadius: 4,
                transform: 'scale(1)',
                animation: 'pulse 1.5s ease-in-out infinite',
                backgroundColor: theme.palette.action.hover,
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.5 },
                },
              }}
            />
          </Box>
        </Fade>
      ))}
    </Box>
  );
};

export default LoadingState;

import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  Chip,
  IconButton,
  Grow,
  useTheme,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Tracker } from '../types/tracker.types';

interface TrackerCardProps {
  tracker: Tracker;
  index: number;
  onOpen: (tracker: Tracker) => void;
  onMoreActions: (event: React.MouseEvent<HTMLElement>, tracker: Tracker) => void;
  getCurrencySymbol: (currency: string) => string;
}

const TrackerCard: React.FC<TrackerCardProps> = ({
  tracker,
  index,
  onOpen,
  onMoreActions,
  getCurrencySymbol,
}) => {
  const theme = useTheme();

  return (
    <Grow in={true} timeout={300 + index * 100}>
      <Card
        elevation={0}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          border: '1px solid',
          borderColor: theme.palette.divider,
          borderRadius: 1,
          boxShadow: 'none',
          background: theme.palette.background.paper,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: theme.palette.primary.main,
          },
        }}
        onClick={() => onOpen(tracker)}
      >
        <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 2.5 } }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 1.5,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: theme.palette.primary.main,
                }}
              >
                {tracker.type === 'business' ? (
                  <BusinessIcon sx={{ color: theme.palette.primary.contrastText, fontSize: 22 }} />
                ) : (
                  <PersonIcon sx={{ color: theme.palette.primary.contrastText, fontSize: 22 }} />
                )}
              </Box>
              <Box>
                <Chip
                  label={tracker.type}
                  size="small"
                  sx={{
                    textTransform: 'capitalize',
                    fontWeight: 600,
                    fontSize: '0.7em',
                    height: 20,
                    background: theme.palette.success.light,
                    color: theme.palette.primary.main,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
              <Chip
                label={getCurrencySymbol(tracker.currency)}
                size="small"
                sx={{
                  fontWeight: 'bold',
                  fontSize: '0.85em',
                  background: theme.palette.action.hover,
                  color: theme.palette.text.primary,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              />
              <IconButton
                size="small"
                onClick={e => onMoreActions(e, tracker)}
                aria-label={`More actions for ${tracker.name}`}
                aria-haspopup="menu"
                sx={{
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    background: theme.palette.action.hover,
                    color: theme.palette.text.primary,
                  },
                }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          <Typography
            variant="h6"
            fontWeight="700"
            gutterBottom
            sx={{
              mb: 1,
              fontSize: { xs: '1em', sm: '1.05em' },
              color: theme.palette.text.primary,
            }}
          >
            {tracker.name}
          </Typography>

          {tracker.description && (
            <Typography
              variant="body2"
              sx={{
                mb: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.4,
                color: theme.palette.text.secondary,
                fontSize: { xs: '0.8125em', sm: '0.875em' },
              }}
            >
              {tracker.description}
            </Typography>
          )}

          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: '0.75em',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            📅{' '}
            {new Date(tracker.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </Typography>
        </CardContent>

        <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
          <Button
            size="small"
            variant="contained"
            onClick={e => {
              e.stopPropagation();
              onOpen(tracker);
            }}
            aria-label={`Open ${tracker.name} tracker`}
            sx={{
              flexGrow: 1,
              background: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2,
              py: 1,
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            Open Tracker
          </Button>
        </CardActions>
      </Card>
    </Grow>
  );
};

export default TrackerCard;

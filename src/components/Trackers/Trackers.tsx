import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Fab,
  Snackbar,
  Alert,
  Fade,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { endpoints } from '../../config/api';
import { getRequest, postRequest, putRequest, deleteRequest } from '../../utils/http';
import { Tracker, TrackerFormData, SnackbarState } from './types/tracker.types';
import LoadingState from './components/LoadingState';
import EmptyState from './components/EmptyState';
import TrackerCard from './components/TrackerCard';
import TrackerActionsDrawer from './components/TrackerActionsDrawer';
import CreateEditDialog from './components/CreateEditDialog';
import DeleteDialog from './components/DeleteDialog';

const Trackers: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [trackers, setTrackers] = useState<Tracker[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedTracker, setSelectedTracker] = useState<Tracker | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuTracker, setMenuTracker] = useState<Tracker | null>(null);

  const [formData, setFormData] = useState<TrackerFormData>({
    name: '',
    type: 'personal',
    description: '',
    currency: 'INR',
  });

  useEffect(() => {
    loadTrackers();
  }, []);

  const loadTrackers = async () => {
    setLoading(true);
    try {
      const response = await getRequest(endpoints.trackers.getAll);
      const trackersData = response.data?.trackers || response.data?.data?.trackers || [];
      setTrackers(trackersData);
    } catch (error) {
      console.error('Error loading trackers:', error);
      setSnackbar({ open: true, message: 'Failed to load trackers', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (tracker?: Tracker) => {
    if (tracker) {
      setEditMode(true);
      setSelectedTracker(tracker);
      setFormData({
        name: tracker.name,
        type: tracker.type,
        description: tracker.description || '',
        currency: tracker.currency,
      });
    } else {
      setEditMode(false);
      setSelectedTracker(null);
      setFormData({
        name: '',
        type: 'personal',
        description: '',
        currency: 'INR',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditMode(false);
    setSelectedTracker(null);
  };

  const handleSave = async () => {
    try {
      if (editMode && selectedTracker) {
        await putRequest(endpoints.trackers.update(selectedTracker.id), formData);
        setSnackbar({ open: true, message: 'Tracker updated successfully', severity: 'success' });
      } else {
        await postRequest(endpoints.trackers.create, formData);
        setSnackbar({ open: true, message: 'Tracker created successfully', severity: 'success' });
      }
      handleCloseDialog();
      loadTrackers();
    } catch (error) {
      console.error('Error saving tracker:', error);
      setSnackbar({ open: true, message: 'Failed to save tracker', severity: 'error' });
    }
  };

  const handleDelete = (tracker: Tracker) => {
    setSelectedTracker(tracker);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedTracker) return;

    try {
      await deleteRequest(endpoints.trackers.delete(selectedTracker.id));
      setDeleteDialogOpen(false);
      setSnackbar({ open: true, message: 'Tracker deleted successfully', severity: 'success' });
      loadTrackers();
    } catch (error) {
      console.error('Error deleting tracker:', error);
      setSnackbar({ open: true, message: 'Failed to delete tracker', severity: 'error' });
    }
  };

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'INR':
        return '₹';
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      case 'GBP':
        return '£';
      default:
        return currency;
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, tracker: Tracker) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuTracker(tracker);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuTracker(null);
  };

  const handleAddToHomeScreen = async (tracker: Tracker) => {
    try {
      window.open(`/tracker/${tracker.id}`, '_blank');
      setSnackbar({
        open: true,
        message: `Opening ${tracker.name}. Use your browser's "Add to Home Screen" option to create an icon!`,
        severity: 'success',
      });
    } catch (error) {
      console.error('Error creating PWA shortcut:', error);
      setSnackbar({
        open: true,
        message: 'Opening tracker in new window. Use browser menu to add to home screen.',
        severity: 'success',
      });
      window.open(`/tracker/${tracker.id}`, '_blank');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 }, px: { xs: 2, sm: 3 } }}>
      <Fade in={true} timeout={500}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3 },
            mb: { xs: 2, sm: 3 },
            borderRadius: 1,
            background: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  mb: 0.5,
                  color: theme.palette.text.primary,
                  fontSize: { xs: '1.25em', sm: '1.5em' },
                }}
              >
                Expense Trackers
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: { xs: '0.875em', sm: '0.9375em' },
                }}
              >
                Create separate trackers for different purposes
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              aria-label="Create new expense tracker"
              sx={{
                display: { xs: 'none', md: 'inline-flex' },
                background: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                fontWeight: 600,
                px: { xs: 2, sm: 2.5 },
                py: { xs: 1, sm: 1.25 },
                borderRadius: 2,
                textTransform: 'none',
                fontSize: { xs: '0.875em', sm: '0.9375em' },
              }}
            >
              Create Tracker
            </Button>
          </Box>
        </Paper>
      </Fade>

      {loading ? (
        <LoadingState />
      ) : trackers.length === 0 ? (
        <EmptyState onCreateClick={() => handleOpenDialog()} />
      ) : (
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
          {trackers.map((tracker, index) => (
            <TrackerCard
              key={tracker.id}
              tracker={tracker}
              index={index}
              onOpen={t => navigate(`/tracker/${t.id}`)}
              onMoreActions={handleMenuOpen}
              getCurrencySymbol={getCurrencySymbol}
            />
          ))}
        </Box>
      )}

      {/* Actions Drawer/Menu */}
      <TrackerActionsDrawer
        anchorEl={anchorEl}
        tracker={menuTracker}
        onClose={handleMenuClose}
        onEdit={() => menuTracker && handleOpenDialog(menuTracker)}
        onDelete={() => menuTracker && handleDelete(menuTracker)}
        onSettings={() => menuTracker && navigate(`/tracker/${menuTracker.id}/settings`)}
        onAddToHome={() => menuTracker && handleAddToHomeScreen(menuTracker)}
        getCurrencySymbol={getCurrencySymbol}
      />

      {/* Create/Edit Dialog */}
      <CreateEditDialog
        open={dialogOpen}
        editMode={editMode}
        formData={formData}
        onClose={handleCloseDialog}
        onSave={handleSave}
        onChange={(field, value) => setFormData({ ...formData, [field]: value })}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        tracker={selectedTracker}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Mobile FAB */}
      <Fab
        color="primary"
        aria-label="Create new tracker"
        onClick={() => handleOpenDialog()}
        sx={{
          position: 'fixed',
          bottom: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
          display: { xs: 'flex', md: 'none' },
          zIndex: 1000,
          boxShadow: theme.shadows[6],
        }}
      >
        <AddIcon />
      </Fab>

      {/* Screen reader live region */}
      <Box
        role="status"
        aria-live="polite"
        aria-atomic="true"
        sx={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
      >
        {loading
          ? 'Loading trackers...'
          : `${trackers.length} tracker${trackers.length !== 1 ? 's' : ''} available`}
      </Box>
    </Container>
  );
};

export default Trackers;

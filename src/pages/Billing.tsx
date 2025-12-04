import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, useTheme } from '@mui/material';
import Lottie from 'lottie-react';
import CurrentPlanCard from '../components/Billing/CurrentPlanCard';
import UpgradeCard from '../components/Billing/UpgradeCard';
import PaymentDialog from '../components/Billing/PaymentDialog';
import { endpoints } from '../config/api';
import { getRequest } from '../utils/http';

const Billing: React.FC = () => {
  const theme = useTheme();
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [trackerCount, setTrackerCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingAnim, setLoadingAnim] = useState<any>(null);
  const currentPlan = 'Free';

  useEffect(() => {
    fetch('/animations/payment_animation.json')
      .then(res => res.json())
      .then(data => setLoadingAnim(data))
      .catch(err => console.error('Error loading animation:', err));
    fetchUsageData();
  }, []);

  const fetchUsageData = async () => {
    try {
      setLoading(true);
      const trackersResponse = await getRequest(endpoints.trackers.getAll);
      const trackersData = trackersResponse.data?.data?.trackers || [];
      setTrackerCount(Array.isArray(trackersData) ? trackersData.length : 0);

      const usageResponse = await getRequest(endpoints.usage.overview);
      const usageData = usageResponse.data?.data || usageResponse.data;
      setMessageCount(usageData?.overall?.totalMessages || 0);
    } catch (error) {
      console.error('Error fetching usage data:', error);
      setTrackerCount(0);
      setMessageCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = () => {
    setPaymentDialogOpen(true);
  };

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          py: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        {loadingAnim && (
          <Lottie animationData={loadingAnim} loop style={{ width: 300, height: 300 }} />
        )}
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            mb: 1,
            background:
              theme.palette.mode === 'dark'
                ? `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.success.light} 100%)`
                : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.success.main} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Billing & Subscription
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your subscription and view usage
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <CurrentPlanCard
            plan={currentPlan}
            trackerCount={trackerCount}
            messageCount={messageCount}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <UpgradeCard onUpgrade={handleUpgrade} />
        </Grid>
      </Grid>

      <PaymentDialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)} />
    </Container>
  );
};

export default Billing;

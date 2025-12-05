import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, useTheme, Paper, Button, Stack } from '@mui/material';
import Lottie from 'lottie-react';
import EmailIcon from '@mui/icons-material/Email';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ActivePlanDisplay from '../components/Billing/ActivePlanDisplay';
import PlanBox from '../components/Billing/PlanBox';
import DowngradeWarningDialog from '../components/Billing/DowngradeWarningDialog';
import PaymentDialog from '../components/Billing/PaymentDialog';
import SupportDialog from '../components/Support/SupportDialog';
import { endpoints } from '../config/api';
import { getRequest } from '../utils/http';
import { type PlanType } from '../config/planConfig';

const Billing: React.FC = () => {
  const theme = useTheme();
  const [currentPlan, setCurrentPlan] = useState<PlanType>('free');
  const [trackerCount, setTrackerCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingAnim, setLoadingAnim] = useState<any>(null);

  // Dialog states
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [downgradeDialogOpen, setDowngradeDialogOpen] = useState(false);
  const [supportDialogOpen, setSupportDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);

  // User data for support dialog
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    fetch('/animations/payment_animation.json')
      .then(res => res.json())
      .then(data => setLoadingAnim(data))
      .catch(err => console.error('Error loading animation:', err));
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch user data
      const userResponse = await getRequest(endpoints.auth.me);
      const userData =
        userResponse?.data?.data?.user || userResponse?.data?.user || userResponse?.data;
      const accountType = (userData?.accountType || 'free').toLowerCase() as PlanType;
      setCurrentPlan(accountType);
      setUserName(userData?.name || '');
      setUserEmail(userData?.email || '');

      // Fetch trackers
      try {
        const trackersResponse = await getRequest(endpoints.trackers.getAll);
        const trackers =
          trackersResponse?.data?.data?.trackers || trackersResponse?.data?.trackers || [];
        setTrackerCount(Array.isArray(trackers) ? trackers.length : 0);
      } catch (err) {
        console.error('Error fetching trackers:', err);
        setTrackerCount(0);
      }

      // Fetch messages
      try {
        const usageResponse = await getRequest(endpoints.usage.overview);
        const usageData = usageResponse?.data?.data || usageResponse?.data;
        const messages = usageData?.overall?.totalMessages || usageData?.totalMessages || 0;
        setMessageCount(messages);
      } catch (err) {
        console.error('Error fetching usage:', err);
        setMessageCount(0);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = (plan: PlanType) => {
    if (plan === 'free') return; // Free plan doesn't need payment
    setSelectedPlan(plan);
    setPaymentDialogOpen(true);
  };

  const handleDowngrade = (plan: PlanType) => {
    setSelectedPlan(plan);
    setDowngradeDialogOpen(true);
  };

  const confirmDowngrade = () => {
    // TODO: Implement actual downgrade API call
    console.log('Downgrading to:', selectedPlan);
    setDowngradeDialogOpen(false);
    setSelectedPlan(null);
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
      {/* Header */}
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
          Manage your plan and view usage
        </Typography>
      </Box>

      {/* Active Plan Display */}
      <Box sx={{ mb: 4 }}>
        <ActivePlanDisplay
          plan={currentPlan}
          trackerCount={trackerCount}
          messageCount={messageCount}
        />
      </Box>

      {/* Plan Boxes */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <PlanBox
            plan="free"
            currentPlan={currentPlan}
            onUpgrade={handleUpgrade}
            onDowngrade={handleDowngrade}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <PlanBox
            plan="pro"
            currentPlan={currentPlan}
            onUpgrade={handleUpgrade}
            onDowngrade={handleDowngrade}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <PlanBox
            plan="businesspro"
            currentPlan={currentPlan}
            onUpgrade={handleUpgrade}
            onDowngrade={handleDowngrade}
          />
        </Grid>
      </Grid>

      {/* Support Section */}
      <Paper
        elevation={0}
        sx={{
          mt: 6,
          p: 4,
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
          textAlign: 'center',
          background:
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(25,118,210,0.05) 0%, rgba(46,125,50,0.05) 100%)'
              : 'linear-gradient(135deg, rgba(25,118,210,0.03) 0%, rgba(46,125,50,0.03) 100%)',
        }}
      >
        <SupportAgentIcon
          sx={{
            fontSize: 48,
            color: theme.palette.primary.main,
            mb: 2,
          }}
        />
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Need Help?
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}
        >
          Our support team is here to assist you with any questions about billing, features, or
          technical issues.
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="center"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmailIcon sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 600,
              }}
            >
              support@spentiva.com
            </Typography>
          </Box>
        </Stack>
        <Button
          variant="contained"
          size="large"
          onClick={() => setSupportDialogOpen(true)}
          sx={{
            px: 4,
            py: 1.5,
            fontWeight: 700,
            borderRadius: 2,
          }}
        >
          Contact Support
        </Button>
      </Paper>

      {/* Dialogs */}
      <PaymentDialog
        open={paymentDialogOpen}
        onClose={() => {
          setPaymentDialogOpen(false);
          setSelectedPlan(null);
        }}
        selectedPlan={selectedPlan}
      />
      <DowngradeWarningDialog
        open={downgradeDialogOpen}
        targetPlan={selectedPlan}
        onConfirm={confirmDowngrade}
        onCancel={() => {
          setDowngradeDialogOpen(false);
          setSelectedPlan(null);
        }}
      />
      <SupportDialog
        open={supportDialogOpen}
        onClose={() => setSupportDialogOpen(false)}
        userName={userName}
        userEmail={userEmail}
        currentPlan={currentPlan}
      />
    </Container>
  );
};

export default Billing;

import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Alert,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
} from '@mui/icons-material';

// Hooks
import { useUsageOverview } from './hooks/useUsageOverview';
import { useUsageGraphs } from './hooks/useUsageGraphs';
import { useTrackerUsage } from './hooks/useTrackerUsage';
import { useUsageLogs } from './hooks/useUsageLogs';

// Components
import UsageOverviewCards from './components/UsageOverviewCards';
import TrackerSelector from './components/TrackerSelector';
import UsageTabs from './components/UsageTabs';

const Usage: React.FC = () => {
  // State
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedTrackerId, setSelectedTrackerId] = useState<string>('all');
  const [logPage, setLogPage] = useState(0);
  const [logRowsPerPage, setLogRowsPerPage] = useState(50);

  // Hooks
  const {
    data: overviewData,
    loading: overviewLoading,
    error: overviewError,
    refetch: refetchOverview
  } = useUsageOverview();

  const {
    data: graphsData,
    loading: graphsLoading,
    refetch: refetchGraphs
  } = useUsageGraphs();

  const {
    stats: trackerStats,
    loading: trackerLoading,
    error: trackerError,
    refetch: refetchTracker
  } = useTrackerUsage(selectedTrackerId !== 'all' ? selectedTrackerId : null);

  const {
    logs,
    totalCount,
    loading: logsLoading,
    error: logsError,
    fetchLogs,
    cleanupOldLogs
  } = useUsageLogs({
    limit: logRowsPerPage,
    offset: logPage * logRowsPerPage,
    autoFetch: false
  });

  // Effects
  useEffect(() => {
    if (currentTab === 2) {
      fetchLogs({
        trackerId: selectedTrackerId !== 'all' ? selectedTrackerId : undefined,
        limit: logRowsPerPage,
        offset: logPage * logRowsPerPage
      });
    }
  }, [currentTab, selectedTrackerId, logPage, logRowsPerPage, fetchLogs]);

  // Handlers
  const handleRefresh = () => {
    refetchOverview();
    refetchGraphs();
    if (selectedTrackerId !== 'all') {
      refetchTracker();
    }
    if (currentTab === 2) {
      fetchLogs();
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleTrackerChange = (trackerId: string) => {
    setSelectedTrackerId(trackerId);
    // Reset logs page when tracker changes
    setLogPage(0);
  };

  const handleCleanupLogs = async () => {
    if (window.confirm('Are you sure you want to delete logs older than 90 days?')) {
      await cleanupOldLogs();
      fetchLogs();
    }
  };

  if (overviewLoading && !overviewData) {
    return (
      <Container maxWidth="xl" sx={{ mt: 3, mb: 4, display: 'flex', justifyContent: 'center', minHeight: '400px', alignItems: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#1a202c' }}>
          Usage Statistics
        </Typography>
        <Tooltip title="Refresh data">
          <IconButton onClick={handleRefresh} color="primary">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {overviewError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {overviewError}
        </Alert>
      )}

      {/* Overall Stats */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1a202c' }}>
          Overall Usage
        </Typography>
        {overviewData ? (
          <UsageOverviewCards data={overviewData} />
        ) : (
          <Alert severity="info">No usage data available.</Alert>
        )}
      </Box>

      {/* Controls */}
      <Box sx={{ mb: 3 }}>
        <TrackerSelector
          trackers={overviewData?.byTracker.map(t => ({
            _id: t.trackerId,
            name: t.trackerName,
            type: t.trackerType
          })) || []}
          selectedTrackerId={selectedTrackerId}
          onChange={handleTrackerChange}
        />
      </Box>

      {/* Tabs Content */}
      <UsageTabs
        currentTab={currentTab}
        onTabChange={handleTabChange}
        selectedTrackerId={selectedTrackerId}
        trackerStats={trackerStats}
        trackerLoading={trackerLoading}
        trackerError={trackerError}
        graphsData={graphsData}
        graphsLoading={graphsLoading}
        logs={logs}
        totalCount={totalCount}
        logsLoading={logsLoading}
        logsError={logsError}
        logPage={logPage}
        logRowsPerPage={logRowsPerPage}
        onLogPageChange={setLogPage}
        onLogRowsPerPageChange={setLogRowsPerPage}
        onRefreshLogs={() => fetchLogs()}
        onCleanupLogs={selectedTrackerId === 'all' ? handleCleanupLogs : undefined}
      />
    </Container>
  );
};

export default Usage;

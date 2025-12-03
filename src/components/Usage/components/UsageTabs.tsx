import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  Typography,
  Alert,
} from '@mui/material';
import {
  ShowChart as ShowChartIcon,
  ListAlt as ListAltIcon,
  AssessmentOutlined as AssessmentIcon,
} from '@mui/icons-material';

import UsageGraphsPanel from './UsageGraphsPanel';
import TrackerStatsPanel from './TrackerStatsPanel';
import UsageLogsTable from './UsageLogsTable';
import { TrackerStats, UsageGraphs, UsageLog } from '../../../types/usage';

interface UsageTabsProps {
  currentTab: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  selectedTrackerId: string;
  trackerStats: TrackerStats | null;
  trackerLoading: boolean;
  trackerError: string | null;
  graphsData: UsageGraphs | null;
  graphsLoading: boolean;
  logs: UsageLog[];
  totalCount: number;
  logsLoading: boolean;
  logsError: string | null;
  logPage: number;
  logRowsPerPage: number;
  onLogPageChange: (newPage: number) => void;
  onLogRowsPerPageChange: (newRowsPerPage: number) => void;
  onRefreshLogs: () => void;
  onCleanupLogs?: () => void;
}

const UsageTabs: React.FC<UsageTabsProps> = ({
  currentTab,
  onTabChange,
  selectedTrackerId,
  trackerStats,
  trackerLoading,
  trackerError,
  graphsData,
  graphsLoading,
  logs,
  totalCount,
  logsLoading,
  logsError,
  logPage,
  logRowsPerPage,
  onLogPageChange,
  onLogRowsPerPageChange,
  onRefreshLogs,
  onCleanupLogs,
}) => {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={currentTab}
          onChange={onTabChange}
          sx={{
            '& .MuiTab-root': {
              fontSize: '0.95em',
              fontWeight: 500,
              textTransform: 'none',
              minHeight: 56,
            },
          }}
        >
          <Tab icon={<AssessmentIcon />} iconPosition="start" label="Details" />
          <Tab icon={<ShowChartIcon />} iconPosition="start" label="Graphs" />
          <Tab icon={<ListAltIcon />} iconPosition="start" label="Logs" />
        </Tabs>
      </Box>

      <CardContent sx={{ p: 3 }}>
        {/* Details Tab */}
        {currentTab === 0 && (
          <Box>
            {selectedTrackerId === 'all' ? (
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Select a tracker to view detailed statistics
                </Typography>
                <Alert severity="info">
                  Please select a specific tracker from the dropdown above to view its detailed usage statistics.
                </Alert>
              </Box>
            ) : (
              <TrackerStatsPanel
                data={trackerStats}
                loading={trackerLoading}
                error={trackerError}
              />
            )}
          </Box>
        )}

        {/* Graphs Tab */}
        {currentTab === 1 && (
          <Box>
            {selectedTrackerId === 'all' ? (
              <UsageGraphsPanel data={graphsData} loading={graphsLoading} />
            ) : (
              <Box>
                <TrackerStatsPanel
                  data={trackerStats}
                  loading={trackerLoading}
                  error={trackerError}
                />
              </Box>
            )}
          </Box>
        )}

        {/* Logs Tab */}
        {currentTab === 2 && (
          <UsageLogsTable
            logs={logs}
            totalCount={totalCount}
            loading={logsLoading}
            error={logsError}
            page={logPage}
            rowsPerPage={logRowsPerPage}
            onPageChange={onLogPageChange}
            onRowsPerPageChange={onLogRowsPerPageChange}
            onRefresh={onRefreshLogs}
            onCleanup={onCleanupLogs}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default UsageTabs;

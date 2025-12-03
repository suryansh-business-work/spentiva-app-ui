import { useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box, CircularProgress } from '@mui/material';
import Header from './components/Header/Header';
import Trackers from './components/Trackers/Trackers';
import TrackerView from './components/TrackerView/TrackerView';
import TrackerCategorySettings from './components/TrackerCategorySettings/TrackerCategorySettings';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import VerifyEmail from './components/Auth/VerifyEmail';
import Profile from './components/Profile/Profile';
import Usage from './components/Usage/Usage';
import { ThemeModeProvider, useThemeMode } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { requestNotificationPermission } from './services/notificationService';
import { themeConfig, getDarkModeConfig } from './theme/palette';

const AppContent = () => {
  const { isDarkMode } = useThemeMode();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const theme = useMemo(
    () =>
      createTheme({
        ...themeConfig,
        ...(isDarkMode && getDarkModeConfig()),
      }),
    [isDarkMode]
  );

  useEffect(() => {
    // Request notification permission
    requestNotificationPermission();
  }, []);

  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {isAuthenticated && <Header />}
          <Box sx={{ flexGrow: 1 }}>
            <Routes>
              <Route
                path="/login"
                element={!isAuthenticated ? <Login /> : <Navigate to="/trackers" replace />}
              />
              <Route
                path="/signup"
                element={!isAuthenticated ? <Signup /> : <Navigate to="/trackers" replace />}
              />
              <Route
                path="/forgot-password"
                element={
                  !isAuthenticated ? <ForgotPassword /> : <Navigate to="/trackers" replace />
                }
              />
              <Route
                path="/reset-password"
                element={!isAuthenticated ? <ResetPassword /> : <Navigate to="/trackers" replace />}
              />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    <Navigate to="/trackers" replace />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/trackers"
                element={isAuthenticated ? <Trackers /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/tracker/:trackerId"
                element={isAuthenticated ? <TrackerView /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/tracker/:trackerId/chat"
                element={
                  isAuthenticated ? (
                    <Navigate
                      to={`/tracker/${window.location.pathname.split('/')[2]}?tab=chat`}
                      replace
                    />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/tracker/:trackerId/dashboard"
                element={
                  isAuthenticated ? (
                    <Navigate
                      to={`/tracker/${window.location.pathname.split('/')[2]}?tab=dashboard`}
                      replace
                    />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/tracker/:trackerId/transactions"
                element={
                  isAuthenticated ? (
                    <Navigate
                      to={`/tracker/${window.location.pathname.split('/')[2]}?tab=transactions`}
                      replace
                    />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/tracker/:trackerId/settings"
                element={
                  isAuthenticated ? <TrackerCategorySettings /> : <Navigate to="/login" replace />
                }
              />
              <Route
                path="/profile"
                element={isAuthenticated ? <Profile /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/usage"
                element={isAuthenticated ? <Usage /> : <Navigate to="/login" replace />}
              />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeModeProvider>
        <AppContent />
      </ThemeModeProvider>
    </AuthProvider>
  );
}

export default App;

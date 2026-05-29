import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Sidebar from './components/Sidebar';
import BackButton from './components/BackButton';
import LoadingScreen from './components/LoadingScreen';
import SplashScreen from './components/SplashScreen';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import NewsPage from './pages/NewsPage';
import NotesPage from './pages/NotesPage';
import CutoffPage from './pages/CutoffPage';
import AIAgentPage from './pages/AIAgentPage';
import BranchRecommenderPage from './pages/BranchRecommenderPage';
import PreviousQuestionsPage from './pages/PreviousQuestionsPage';
import SettingsPage from './pages/SettingsPage';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  
  return children;
}

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return <LoadingScreen />;

  return (
    <>
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <BackButton />
      <Routes>
        <Route 
          path="/auth" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage />} 
        />
        <Route path="/" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/news" element={
          <ProtectedRoute><NewsPage /></ProtectedRoute>
        } />
        <Route path="/notes" element={
          <ProtectedRoute><NotesPage /></ProtectedRoute>
        } />
        <Route path="/cutoff" element={
          <ProtectedRoute><CutoffPage /></ProtectedRoute>
        } />
        <Route path="/ai" element={
          <ProtectedRoute><AIAgentPage /></ProtectedRoute>
        } />
        <Route path="/recommend" element={
          <ProtectedRoute><BranchRecommenderPage /></ProtectedRoute>
        } />
        <Route path="/questions" element={
          <ProtectedRoute><PreviousQuestionsPage /></ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute><SettingsPage /></ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

import { AppContextProvider, useApp } from './context/AppContext';
import Dashboard from './components/Dashboard';
import ApplicantDetail from './components/ApplicantDetail';
import HostGallery from './components/HostGallery';
import ToastContainer from './components/ToastContainer';

function AppContent() {
  const { selectedApplicantId, showHostGallery } = useApp();

  if (showHostGallery) return <HostGallery />;
  if (selectedApplicantId !== null) return <ApplicantDetail />;
  return <Dashboard />;
}

export default function App() {
  return (
    <AppContextProvider>
      <div style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif', minHeight: '100vh' }}>
        <AppContent />
        <ToastContainer />
      </div>
    </AppContextProvider>
  );
}

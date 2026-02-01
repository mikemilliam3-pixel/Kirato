
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Home from './pages/Home';

// Lazy loading is not used here for simplicity as per requirements of separate files
import SalesPage from './pages/modules/SalesPage';
import SMMPage from './pages/modules/SMMPage';
import EducationPage from './pages/modules/EducationPage';
import FreelancerPage from './pages/modules/FreelancerPage';
import TravelPage from './pages/modules/TravelPage';
import HealthPage from './pages/modules/HealthPage';
import LegalPage from './pages/modules/LegalPage';
import ResumePage from './pages/modules/ResumePage';
import VoicePage from './pages/modules/VoicePage';
import AutomationPage from './pages/modules/AutomationPage';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen relative bg-gray-50 dark:bg-slate-950 flex flex-col">
          <Routes>
            <Route path="/" element={
              <>
                <Header />
                <div className="flex-1 overflow-y-auto">
                  <Home />
                </div>
              </>
            } />
            <Route path="/modules/sales/*" element={<SalesPage />} />
            <Route path="/modules/smm/*" element={<SMMPage />} />
            <Route path="/modules/education/*" element={<EducationPage />} />
            <Route path="/modules/freelancer/*" element={<FreelancerPage />} />
            <Route path="/modules/travel/*" element={<TravelPage />} />
            <Route path="/modules/health/*" element={<HealthPage />} />
            <Route path="/modules/legal/*" element={<LegalPage />} />
            <Route path="/modules/resume/*" element={<ResumePage />} />
            <Route path="/modules/voice/*" element={<VoicePage />} />
            <Route path="/modules/automation/*" element={<AutomationPage />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;

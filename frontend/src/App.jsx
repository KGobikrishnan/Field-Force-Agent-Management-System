import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { ToastContainer } from './components/common/Toast';
import { SearchDialog } from './components/common/SearchDialog';

// Dashboards
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { TeamLeaderDashboard } from './components/dashboard/TeamLeaderDashboard';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';

// Screens
import { TaskBoard } from './components/tasks/TaskBoard';
import { CollectionsTracker } from './components/tasks/CollectionsTracker';
import { LeadPipeline } from './components/leads/LeadPipeline';
import { TeamHierarchy } from './components/team/TeamHierarchy';
import { ReportsView } from './components/reports/ReportsView';

function MainContent() {
  const { activeTab, currentRole, ROLES } = useApp();

  const renderScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        if (currentRole === ROLES.ADMIN) return <AdminDashboard />;
        if (currentRole === ROLES.TEAM_LEADER) return <TeamLeaderDashboard />;
        return <ExecutiveDashboard />;

      case 'tasks':
        return <TaskBoard />;

      case 'collections':
        return <CollectionsTracker />;

      case 'leads':
        return <LeadPipeline />;

      case 'team':
        return <TeamHierarchy />;

      case 'reports':
        return <ReportsView />;

      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50/60">
        {/* Navbar */}
        <Navbar />

        {/* Dynamic Page Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          <div className="max-w-7xl mx-auto">{renderScreen()}</div>
        </main>
      </div>

      {/* Mobile persistent bottom nav */}
      <MobileNav />

      {/* Global Modals & Notifications */}
      <SearchDialog />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

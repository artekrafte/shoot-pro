import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { LoginForm } from '@/components/LoginForm';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/components/Dashboard';
import { SessionTracker } from '@/components/SessionTracker';
import { TargetGallery } from '@/components/TargetGallery';
import { AmmoTracker } from '@/components/AmmoTracker';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from '@/hooks/useAuth';
import { useShootingData } from '@/hooks/useShootingData';

function App() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const {
    sessions,
    targets,
    ammoInventory,
    addSession,
    addTarget,
    updateAmmoInventory,
    handleUseAmmo
  } = useShootingData(user?.id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading ShotTracker Pro...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Helmet>
          <title>ShotTracker Pro - Login</title>
          <meta name="description" content="Sign in to ShotTracker Pro to track your shooting sports progress across shotgun, rifle, and pistol disciplines." />
        </Helmet>
        <LoginForm />
        <Toaster />
      </>
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            sessions={sessions}
            targets={targets}
            ammoInventory={ammoInventory}
          />
        );
      case 'sessions':
        return (
          <SessionTracker 
            sessions={sessions}
            addSession={addSession}
            handleUseAmmo={handleUseAmmo}
            ammoInventory={ammoInventory}
          />
        );
      case 'targets':
        return (
          <TargetGallery 
            targets={targets}
            addTarget={addTarget}
          />
        );
      case 'ammo':
        return (
          <AmmoTracker 
            ammoInventory={ammoInventory}
            updateAmmoInventory={updateAmmoInventory}
            handleUseAmmo={handleUseAmmo}
          />
        );
      default:
        return <Dashboard sessions={sessions} targets={targets} ammoInventory={ammoInventory} />;
    }
  };

  const getPageTitle = () => {
    const titles = {
      dashboard: 'Dashboard',
      sessions: 'Training Sessions',
      targets: 'Target Gallery',
      ammo: 'Ammo Inventory'
    };
    return `${titles[activeTab]} - ShotTracker Pro`;
  };

  const getPageDescription = () => {
    const descriptions = {
      dashboard: 'Track your shooting sports progress with comprehensive analytics and performance insights.',
      sessions: 'Record and manage your shooting training sessions across multiple disciplines.',
      targets: 'View and organize your target shooting achievements and results.',
      ammo: 'Manage your ammunition inventory and track usage across different calibers.'
    };
    return descriptions[activeTab];
  };

  return (
    <>
      <Helmet>
        <title>{getPageTitle()}</title>
        <meta name="description" content={getPageDescription()} />
      </Helmet>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderActiveTab()}
        </motion.div>
      </Layout>
      <Toaster />
    </>
  );
}

export default App;
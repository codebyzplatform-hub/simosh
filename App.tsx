
import React, { useState, useEffect } from 'react';
import { mockDb } from './services/mockDb';
import { User, Role } from './types';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import GuestHome from './pages/GuestHome';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'guest' | 'admin_login' | 'admin_dashboard'>('guest');

  useEffect(() => {
    const currentUser = mockDb.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      if (currentUser.role === Role.ADMIN) {
        setView('admin_dashboard');
      }
    }
  }, []);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setView('admin_dashboard');
  };

  const handleLogout = () => {
    mockDb.logout();
    setUser(null);
    setView('guest');
  };

  const renderContent = () => {
    switch (view) {
      case 'admin_dashboard':
        return user?.role === Role.ADMIN ? (
          <AdminDashboard onLogout={handleLogout} />
        ) : (
          <AdminLogin onLoginSuccess={handleLoginSuccess} onBack={() => setView('guest')} />
        );
      case 'admin_login':
        return <AdminLogin onLoginSuccess={handleLoginSuccess} onBack={() => setView('guest')} />;
      case 'guest':
      default:
        return <GuestHome onAdminClick={() => setView('admin_login')} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderContent()}
    </div>
  );
};

export default App;

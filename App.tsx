import React, { useState } from 'react';
import { User, UserRole } from './types';
import { Login } from './pages/Login';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Simple Conditional Routing based on User State
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  if (user.role === UserRole.CUSTOMER) {
    return <CustomerDashboard user={user} onLogout={handleLogout} />;
  }

  if (user.role === UserRole.ADMIN) {
    return <AdminDashboard user={user} onLogout={handleLogout} />;
  }

  return null;
};

export default App;
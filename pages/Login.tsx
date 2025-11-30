import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ShieldCheck, User as UserIcon } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate Network Request
    await new Promise(r => setTimeout(r, 800));

    // Hardcoded Credentials Logic (as per POC requirements)
    if (username === 'cust1' && password === 'pass') {
      onLogin({
        username: 'cust1',
        role: UserRole.CUSTOMER,
        name: 'John Doe',
        cardNumber: '4123456789012345'
      });
    } else if (username === 'admin' && password === 'admin') {
      onLogin({
        username: 'admin',
        role: UserRole.ADMIN,
        name: 'Super Admin'
      });
    } else {
      setError('Invalid credentials. Try cust1/pass or admin/admin');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 p-8 text-center">
          <div className="mx-auto h-16 w-16 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
            <ShieldCheck className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Secure Banking Portal</h2>
          <p className="text-blue-100 mt-2">Sign in to manage your account</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. cust1 or admin"
              autoFocus
            />
            
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
            />

            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-start">
                <AlertCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" isLoading={loading}>
              Sign In
            </Button>

            <div className="mt-6 pt-6 border-t border-slate-100 text-xs text-slate-500">
              <p className="font-semibold mb-2">Demo Credentials:</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-2 rounded">
                  <p className="font-bold">Customer</p>
                  <p>User: cust1</p>
                  <p>Pass: pass</p>
                </div>
                <div className="bg-slate-50 p-2 rounded">
                  <p className="font-bold">Admin</p>
                  <p>User: admin</p>
                  <p>Pass: admin</p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const AlertCircleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
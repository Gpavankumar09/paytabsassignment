import React, { useEffect, useState } from 'react';
import { User, Transaction } from '../types';
import { bankApi } from '../services/mockBankService';
import { TransactionTable } from '../components/TransactionTable';
import { Button } from '../components/Button';
import { LayoutDashboard, LogOut, RefreshCw, TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Statistics
  const [stats, setStats] = useState({ totalVolume: 0, successCount: 0, failedCount: 0 });

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const txData = await bankApi.getAllTransactions();
      setTransactions(txData);
      
      // Calculate Stats
      const volume = txData.filter(t => t.status === 'SUCCESS').reduce((acc, curr) => acc + curr.amount, 0);
      const success = txData.filter(t => t.status === 'SUCCESS').length;
      const failed = txData.filter(t => t.status === 'FAILED').length;
      setStats({ totalVolume: volume, successCount: success, failedCount: failed });

    } catch (error) {
      console.error("Failed to fetch admin data", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <RefreshCw className="animate-spin text-blue-600 w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-slate-900 text-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <LayoutDashboard className="h-6 w-6 text-blue-400 mr-3" />
              <h1 className="text-xl font-bold tracking-tight">Core Banking Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-slate-300 text-sm hidden sm:block">Logged in as {user.username}</span>
              <Button variant="secondary" onClick={onLogout} className="!py-1.5 !px-3 text-sm !bg-slate-800 hover:!bg-slate-700">
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">System Overview</h2>
            <p className="text-slate-500">Real-time monitoring of transaction flows.</p>
          </div>
          <Button onClick={fetchData} isLoading={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} /> Refresh Data
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Volume</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">${stats.totalVolume.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Successful Txns</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.successCount}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Failed Txns</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{stats.failedCount}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Global Transactions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg font-bold text-slate-800">Global Transaction Log</h3>
          </div>
          <TransactionTable transactions={transactions} isAdmin />
        </div>

      </main>
    </div>
  );
};
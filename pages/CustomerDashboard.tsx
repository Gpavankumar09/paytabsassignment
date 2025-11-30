import React, { useEffect, useState } from 'react';
import { User, Card, Transaction, TransactionType } from '../types';
import { bankApi, system1Gateway } from '../services/mockBankService';
import { TransactionTable } from '../components/TransactionTable';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { CreditCard, Wallet, RefreshCw, LogOut, ArrowRight, DollarSign } from 'lucide-react';

interface CustomerDashboardProps {
  user: User;
  onLogout: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ user, onLogout }) => {
  const [card, setCard] = useState<Card | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Transaction Form State
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [txType, setTxType] = useState<TransactionType>('topup');
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const fetchData = async () => {
    if (!user.cardNumber) return;
    setRefreshing(true);
    try {
      const cardData = await bankApi.getCardDetails(user.cardNumber);
      const txData = await bankApi.getCustomerTransactions(user.cardNumber);
      if (cardData) setCard(cardData);
      setTransactions(txData);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.cardNumber]);

  const handleTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.cardNumber || !card) return;

    setProcessing(true);
    setMessage(null);

    try {
      const response = await system1Gateway.processTransaction({
        cardNumber: user.cardNumber,
        amount: parseFloat(amount),
        pin: pin,
        type: txType
      });

      if (response.success) {
        setMessage({ type: 'success', text: `Transaction successful!` });
        setAmount('');
        setPin('');
        fetchData(); // Refresh data
      } else {
        setMessage({ type: 'error', text: response.message || 'Transaction failed' });
        fetchData(); // Refresh to show failed log
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <RefreshCw className="animate-spin text-blue-600 w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="bg-blue-600 p-2 rounded-lg mr-3">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-800">My Bank</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-slate-600 hidden sm:block">Welcome, <span className="font-semibold text-slate-900">{user.name}</span></span>
              <Button variant="outline" onClick={onLogout} className="!py-1.5 !px-3 text-sm">
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Card & Balance */}
          <div className="space-y-6">
            
            {/* Card Widget */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-xl overflow-hidden p-6 text-white relative h-56 flex flex-col justify-between">
              <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
              
              <div className="flex justify-between items-start z-10">
                <div>
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Current Balance</p>
                  <h2 className="text-3xl font-bold">${card?.balance.toFixed(2)}</h2>
                </div>
                <CreditCard className="w-8 h-8 text-slate-400" />
              </div>

              <div className="z-10">
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">Card Number</p>
                <div className="font-mono text-xl tracking-widest text-shadow-sm">
                  {card?.cardNumber.replace(/(\d{4})/g, '$1 ').trim()}
                </div>
                <div className="flex justify-between mt-4 items-end">
                  <p className="text-sm font-medium text-slate-300">{card?.customerName}</p>
                  <p className="text-xs text-slate-400">EXP 12/28</p>
                </div>
              </div>
            </div>

            {/* Action Form */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Action</h3>
              
              {/* Tabs */}
              <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
                <button 
                  onClick={() => { setTxType('topup'); setMessage(null); }}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${txType === 'topup' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Top Up
                </button>
                <button 
                  onClick={() => { setTxType('withdraw'); setMessage(null); }}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${txType === 'withdraw' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Withdraw
                </button>
              </div>

              <form onSubmit={handleTransaction} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <Input
                  label="Enter PIN"
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  maxLength={4}
                  required
                  placeholder="****"
                />

                {message && (
                  <div className={`p-3 rounded-lg text-sm flex items-start ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    {message.text}
                  </div>
                )}

                <Button type="submit" className="w-full" isLoading={processing}>
                  {txType === 'topup' ? 'Add Funds' : 'Withdraw Funds'} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </div>

          </div>

          {/* Right Column: History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
              <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">Transaction History</h3>
                <Button variant="outline" onClick={fetchData} isLoading={refreshing} className="!py-1.5 !px-3 text-sm">
                  <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
                </Button>
              </div>
              <div className="p-0">
                <TransactionTable transactions={transactions} />
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};
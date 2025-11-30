import React from 'react';
import { Transaction } from '../types';
import { ArrowDownLeft, ArrowUpRight, AlertCircle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

interface TransactionTableProps {
  transactions: Transaction[];
  isAdmin?: boolean;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, isAdmin = false }) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-xl border border-slate-200">
        <p className="text-slate-500">No transactions found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white border border-slate-200 rounded-xl shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
              {isAdmin && <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Card</th>}
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                      tx.type === 'topup' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                    }`}>
                      {tx.type === 'topup' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                    </div>
                    <span className="ml-3 text-sm font-medium text-slate-900 capitalize">{tx.type}</span>
                  </div>
                </td>
                {isAdmin && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
                    {tx.cardNumber}
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-semibold ${tx.type === 'topup' ? 'text-green-600' : 'text-slate-900'}`}>
                    {tx.type === 'topup' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {tx.status === 'SUCCESS' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle size={12} className="mr-1" /> Success
                    </span>
                  ) : (
                    <div className="flex flex-col">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 w-fit">
                        <AlertCircle size={12} className="mr-1" /> Failed
                      </span>
                      {tx.reason && <span className="text-xs text-red-500 mt-1">{tx.reason}</span>}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {format(new Date(tx.timestamp), 'MMM d, yyyy HH:mm')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
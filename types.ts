export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN'
}

export interface User {
  username: string;
  role: UserRole;
  name: string;
  cardNumber?: string; // Only for customers
}

export interface Card {
  cardNumber: string;
  pinHash: string;
  balance: number;
  customerName: string;
}

export type TransactionType = 'withdraw' | 'topup';
export type TransactionStatus = 'SUCCESS' | 'FAILED';

export interface Transaction {
  id: number;
  cardNumber: string;
  type: TransactionType;
  amount: number;
  timestamp: string; // ISO string
  status: TransactionStatus;
  reason?: string;
}

export interface TransactionRequest {
  cardNumber: string;
  pin: string;
  amount: number;
  type: TransactionType;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
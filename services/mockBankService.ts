import { Card, Transaction, TransactionRequest, APIResponse, TransactionStatus } from '../types';

// --- In-Memory Database (System 2) ---

// Initial Mock Data
const INITIAL_CARD: Card = {
  cardNumber: "4123456789012345",
  pinHash: "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4", // SHA-256 for "1234"
  balance: 1000.00,
  customerName: "John Doe"
};

// Simple storage simulation
let cards: Map<string, Card> = new Map();
cards.set(INITIAL_CARD.cardNumber, { ...INITIAL_CARD });

let transactions: Transaction[] = [
  {
    id: 1001,
    cardNumber: "4123456789012345",
    type: "topup",
    amount: 1000.00,
    timestamp: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    status: "SUCCESS",
    reason: "Initial Deposit"
  }
];

// Helper to simulate SHA-256 (Using Web Crypto API)
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// --- System 2: Core Banking Logic ---

const system2Process = async (req: TransactionRequest): Promise<APIResponse<Transaction>> => {
  await new Promise(resolve => setTimeout(resolve, 600)); // Simulate network latency

  const card = cards.get(req.cardNumber);
  
  // 1. Find Card
  if (!card) {
    return { success: false, message: "Card not found" };
  }

  // 2. Validate PIN
  const inputPinHash = await sha256(req.pin);
  if (inputPinHash !== card.pinHash) {
    // Log failed transaction
    const failedTx: Transaction = {
      id: Date.now(),
      cardNumber: req.cardNumber,
      type: req.type,
      amount: req.amount,
      timestamp: new Date().toISOString(),
      status: "FAILED",
      reason: "Invalid PIN"
    };
    transactions.unshift(failedTx);
    return { success: false, message: "Invalid PIN", data: failedTx };
  }

  // 3. Process Logic
  if (req.type === 'withdraw') {
    if (card.balance < req.amount) {
       const failedTx: Transaction = {
        id: Date.now(),
        cardNumber: req.cardNumber,
        type: req.type,
        amount: req.amount,
        timestamp: new Date().toISOString(),
        status: "FAILED",
        reason: "Insufficient Funds"
      };
      transactions.unshift(failedTx);
      return { success: false, message: "Insufficient Funds", data: failedTx };
    }
    card.balance -= req.amount;
  } else if (req.type === 'topup') {
    card.balance += req.amount;
  }

  // 4. Save State
  cards.set(req.cardNumber, card);

  const successTx: Transaction = {
    id: Date.now(),
    cardNumber: req.cardNumber,
    type: req.type,
    amount: req.amount,
    timestamp: new Date().toISOString(),
    status: "SUCCESS"
  };
  transactions.unshift(successTx);

  return { success: true, data: successTx, message: "Transaction Successful" };
};

// --- System 1: Gateway Logic ---

export const system1Gateway = {
  processTransaction: async (req: TransactionRequest): Promise<APIResponse<Transaction>> => {
    // 1. Gateway Validation: Check Card Range
    if (!req.cardNumber.startsWith("4")) {
      return { success: false, message: "System 1 Error: Card range not supported. Only cards starting with '4' are allowed." };
    }

    if (req.amount <= 0) {
       return { success: false, message: "System 1 Error: Amount must be positive." };
    }

    // 2. Forward to System 2
    return await system2Process(req);
  }
};

// --- Read APIs (For UI) ---

export const bankApi = {
  getCardDetails: async (cardNumber: string): Promise<Card | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return cards.get(cardNumber);
  },
  
  getCustomerTransactions: async (cardNumber: string): Promise<Transaction[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return transactions.filter(t => t.cardNumber === cardNumber);
  },

  getAllTransactions: async (): Promise<Transaction[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [...transactions]; // Return copy
  }
};

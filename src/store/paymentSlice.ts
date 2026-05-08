import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PaymentState, Transaction, PaymentStatus } from "@/types";

const STORAGE_KEY = "payment_transactions";

function loadTransactions(): Transaction[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Transaction[]) : [];
  } catch {
    return [];
  }
}

function saveTransactions(transactions: Transaction[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch {
    // ignore storage errors
  }
}

const initialState: PaymentState = {
  status: "idle",
  currentTransactionId: null,
  attemptCount: 0,
  failureReason: null,
  transactions: [],
  selectedTransaction: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    hydrateTransactions(state) {
      state.transactions = loadTransactions();
    },
    startPayment(
      state,
      action: PayloadAction<{ transactionId: string }>
    ) {
      state.status = "processing";
      state.currentTransactionId = action.payload.transactionId;
      state.attemptCount += 1;
      state.failureReason = null;
    },
    paymentSuccess(state, action: PayloadAction<Transaction>) {
      state.status = "success";
      const existing = state.transactions.findIndex(
        (t) => t.id === action.payload.id
      );
      if (existing >= 0) {
        state.transactions[existing] = action.payload;
      } else {
        state.transactions.unshift(action.payload);
      }
      saveTransactions(state.transactions);
    },
    paymentFailed(
      state,
      action: PayloadAction<{ reason: string; transaction: Transaction }>
    ) {
      state.status = "failed";
      state.failureReason = action.payload.reason;
      const existing = state.transactions.findIndex(
        (t) => t.id === action.payload.transaction.id
      );
      if (existing >= 0) {
        state.transactions[existing] = action.payload.transaction;
      } else {
        state.transactions.unshift(action.payload.transaction);
      }
      saveTransactions(state.transactions);
    },
    paymentTimeout(state, action: PayloadAction<Transaction>) {
      state.status = "timeout";
      state.failureReason = "Request timed out. Please try again.";
      const existing = state.transactions.findIndex(
        (t) => t.id === action.payload.id
      );
      if (existing >= 0) {
        state.transactions[existing] = action.payload;
      } else {
        state.transactions.unshift(action.payload);
      }
      saveTransactions(state.transactions);
    },
    resetPayment(state) {
      state.status = "idle";
      state.currentTransactionId = null;
      state.attemptCount = 0;
      state.failureReason = null;
    },
    newPayment(state) {
      state.status = "idle";
      state.currentTransactionId = null;
      state.attemptCount = 0;
      state.failureReason = null;
    },
    setSelectedTransaction(
      state,
      action: PayloadAction<Transaction | null>
    ) {
      state.selectedTransaction = action.payload;
    },
    setStatus(state, action: PayloadAction<PaymentStatus>) {
      state.status = action.payload;
    },
  },
});

export const {
  hydrateTransactions,
  startPayment,
  paymentSuccess,
  paymentFailed,
  paymentTimeout,
  resetPayment,
  newPayment,
  setSelectedTransaction,
  setStatus,
} = paymentSlice.actions;

export default paymentSlice.reducer;

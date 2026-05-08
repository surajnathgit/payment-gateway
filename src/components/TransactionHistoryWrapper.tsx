"use client";

import TransactionHistory from "./TransactionHistory";
import { useAppSelector } from "@/store/hooks";

export default function TransactionHistoryWrapper() {
  const transactions = useAppSelector((s) => s.payment.transactions);
  return <TransactionHistory transactions={transactions} />;
}

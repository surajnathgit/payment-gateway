export type CardType = "visa" | "mastercard" | "amex" | "unknown";

export type PaymentStatus = "idle" | "processing" | "success" | "failed" | "timeout";

export type Currency = "INR" | "USD";

export interface CardDetails {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export interface PaymentFormData extends CardDetails {
  amount: string;
  currency: Currency;
}

export interface PaymentPayload {
  transactionId: string;
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  amount: number;
  currency: Currency;
  attemptNumber: number;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: Currency;
  status: Exclude<PaymentStatus, "idle" | "processing">;
  timestamp: string;
  cardholderName: string;
  cardLast4: string;
  cardType: CardType;
  failureReason?: string;
  attemptCount: number;
}

export interface GatewayResponse {
  success: boolean;
  transactionId: string;
  failureReason?: string;
}

export interface FormErrors {
  cardholderName?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  amount?: string;
}

export interface PaymentState {
  status: PaymentStatus;
  currentTransactionId: string | null;
  attemptCount: number;
  failureReason: string | null;
  transactions: Transaction[];
  selectedTransaction: Transaction | null;
}

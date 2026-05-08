"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  startPayment,
  paymentSuccess,
  paymentFailed,
  paymentTimeout,
  newPayment,
  resetPayment,
} from "@/store/paymentSlice";
import { submitPayment } from "@/utils/apiUtils";
import { detectCardType } from "@/utils/cardUtils";
import { Currency, PaymentFormData, Transaction } from "@/types";

const MAX_RETRIES = 3;

export function usePayment() {
  const dispatch = useAppDispatch();
  const { status, currentTransactionId, attemptCount, failureReason, transactions } =
    useAppSelector((s) => s.payment);

  const processPayment = useCallback(
    async (formData: PaymentFormData, transactionId: string) => {
      if (attemptCount >= MAX_RETRIES) return;

      dispatch(startPayment({ transactionId }));

      const cardType = detectCardType(formData.cardNumber);
      const cleanedNumber = formData.cardNumber.replace(/\s/g, "");
      const cardLast4 = cleanedNumber.slice(-4);
      const currentAttempt = attemptCount + 1;

      try {
        const result = await submitPayment({
          transactionId,
          cardholderName: formData.cardholderName,
          cardNumber: cleanedNumber,
          expiryDate: formData.expiryDate,
          cvv: formData.cvv,
          amount: parseFloat(formData.amount),
          currency: formData.currency as Currency,
          attemptNumber: currentAttempt,
        });

        const transaction: Transaction = {
          id: transactionId,
          amount: parseFloat(formData.amount),
          currency: formData.currency as Currency,
          status: result.success ? "success" : "failed",
          timestamp: new Date().toISOString(),
          cardholderName: formData.cardholderName,
          cardLast4,
          cardType,
          failureReason: result.failureReason,
          attemptCount: currentAttempt,
        };

        if (result.success) {
          dispatch(paymentSuccess(transaction));
        } else {
          dispatch(
            paymentFailed({
              reason: result.failureReason ?? "Payment failed",
              transaction,
            })
          );
        }
      } catch (error) {
        const isTimeout =
          error instanceof Error && error.message === "TIMEOUT";

        const transaction: Transaction = {
          id: transactionId,
          amount: parseFloat(formData.amount),
          currency: formData.currency as Currency,
          status: "timeout",
          timestamp: new Date().toISOString(),
          cardholderName: formData.cardholderName,
          cardLast4,
          cardType,
          failureReason: isTimeout
            ? "Request timed out"
            : "Network error occurred",
          attemptCount: currentAttempt,
        };

        if (isTimeout) {
          dispatch(paymentTimeout(transaction));
        } else {
          dispatch(
            paymentFailed({
              reason: "Network error. Please check your connection.",
              transaction,
            })
          );
        }
      }
    },
    [dispatch, attemptCount]
  );

  const handleNewPayment = useCallback(() => {
    dispatch(newPayment());
  }, [dispatch]);

  const handleReset = useCallback(() => {
    dispatch(resetPayment());
  }, [dispatch]);

  const canRetry =
    (status === "failed" || status === "timeout") &&
    attemptCount < MAX_RETRIES;

  const isMaxRetries = attemptCount >= MAX_RETRIES;

  return {
    status,
    currentTransactionId,
    attemptCount,
    failureReason,
    transactions,
    processPayment,
    handleNewPayment,
    handleReset,
    canRetry,
    isMaxRetries,
    maxRetries: MAX_RETRIES,
  };
}

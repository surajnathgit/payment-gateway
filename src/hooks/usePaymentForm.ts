"use client";

import { useState, useCallback, useRef } from "react";
import {
  formatCardNumber,
  formatExpiryDate,
  detectCardType,
  validateField,
  isFormValid,
} from "@/utils/cardUtils";
import { CardType, Currency, FormErrors, PaymentFormData } from "@/types";

const initialFormData: PaymentFormData = {
  cardholderName: "",
  cardNumber: "",
  expiryDate: "",
  cvv: "",
  amount: "",
  currency: "INR",
};

export function usePaymentForm() {
  const [formData, setFormData] = useState<PaymentFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof PaymentFormData, boolean>>>({});
  const [cardType, setCardType] = useState<CardType>("unknown");
  const transactionIdRef = useRef<string | null>(null);

  const getOrCreateTransactionId = useCallback((): string => {
    if (!transactionIdRef.current) {
      transactionIdRef.current = crypto.randomUUID();
    }
    return transactionIdRef.current;
  }, []);

  const resetTransactionId = useCallback(() => {
    transactionIdRef.current = null;
  }, []);

  const handleChange = useCallback(
    (name: keyof PaymentFormData, value: string) => {
      let processedValue = value;

      if (name === "cardNumber") {
        const detected = detectCardType(value);
        setCardType(detected);
        processedValue = formatCardNumber(value, detected);
      } else if (name === "expiryDate") {
        processedValue = formatExpiryDate(value);
      } else if (name === "cvv") {
        const maxLen = detectCardType(formData.cardNumber) === "amex" ? 4 : 3;
        processedValue = value.replace(/\D/g, "").slice(0, maxLen);
      } else if (name === "amount") {
        processedValue = value.replace(/[^0-9.]/g, "");
        const parts = processedValue.split(".");
        if (parts.length > 2) processedValue = `${parts[0]}.${parts[1]}`;
      }

      setFormData((prev) => ({ ...prev, [name]: processedValue }));

      if (touched[name]) {
        const updatedForm = { ...formData, [name]: processedValue };
        const error = validateField(name, processedValue, updatedForm);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [formData, touched]
  );

  const handleBlur = useCallback(
    (name: keyof PaymentFormData) => {
      setTouched((prev) => ({ ...prev, [name]: true }));
      const error = validateField(name, formData[name], formData);
      setErrors((prev) => ({ ...prev, [name]: error }));
    },
    [formData]
  );

  const handleCurrencyChange = useCallback((currency: Currency) => {
    setFormData((prev) => ({ ...prev, currency }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setTouched({});
    setCardType("unknown");
    transactionIdRef.current = null;
  }, []);

  const isValid = isFormValid(formData);

  return {
    formData,
    errors,
    touched,
    cardType,
    isValid,
    handleChange,
    handleBlur,
    handleCurrencyChange,
    resetForm,
    getOrCreateTransactionId,
    resetTransactionId,
  };
}

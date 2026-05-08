import { CardType, FormErrors, PaymentFormData } from "@/types";

export function detectCardType(cardNumber: string): CardType {
  const cleaned = cardNumber.replace(/\s/g, "");
  if (/^4/.test(cleaned)) return "visa";
  if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return "mastercard";
  if (/^3[47]/.test(cleaned)) return "amex";
  return "unknown";
}

export function formatCardNumber(value: string, cardType: CardType): string {
  const cleaned = value.replace(/\D/g, "");
  const maxLength = cardType === "amex" ? 15 : 16;
  const trimmed = cleaned.slice(0, maxLength);

  if (cardType === "amex") {
    const p1 = trimmed.slice(0, 4);
    const p2 = trimmed.slice(4, 10);
    const p3 = trimmed.slice(10, 15);
    return [p1, p2, p3].filter(Boolean).join(" ");
  }

  const parts: string[] = [];
  for (let i = 0; i < trimmed.length; i += 4) {
    parts.push(trimmed.slice(i, i + 4));
  }
  return parts.join(" ");
}

export function formatExpiryDate(value: string): string {
  const cleaned = value.replace(/\D/g, "").slice(0, 4);
  if (cleaned.length >= 3) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
  }
  if (cleaned.length === 2) {
    return cleaned;
  }
  return cleaned;
}

export function isExpiryPast(expiry: string): boolean {
  const [monthStr, yearStr] = expiry.split("/");
  if (!monthStr || !yearStr || yearStr.length < 2) return false;
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr.length === 2 ? `20${yearStr}` : yearStr, 10);
  if (isNaN(month) || isNaN(year)) return false;
  const now = new Date();
  const expDate = new Date(year, month - 1, 1);
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  return expDate < thisMonth;
}

export function validateField(
  name: keyof PaymentFormData,
  value: string,
  formData: PaymentFormData
): string | undefined {
  switch (name) {
    case "cardholderName": {
      if (!value.trim()) return "Cardholder name is required";
      if (value.trim().length < 2) return "Name must be at least 2 characters";
      if (!/^[a-zA-Z\s'-]+$/.test(value.trim()))
        return "Name may only contain letters, spaces, hyphens, and apostrophes";
      return undefined;
    }
    case "cardNumber": {
      const cleaned = value.replace(/\s/g, "");
      if (!cleaned) return "Card number is required";
      const cardType = detectCardType(value);
      const requiredLength = cardType === "amex" ? 15 : 16;
      if (cleaned.length < requiredLength)
        return `Card number must be ${requiredLength} digits`;
      return undefined;
    }
    case "expiryDate": {
      if (!value) return "Expiry date is required";
      if (!/^\d{2}\/\d{2}$/.test(value)) return "Use MM/YY format";
      const [monthStr] = value.split("/");
      const month = parseInt(monthStr, 10);
      if (month < 1 || month > 12) return "Invalid month";
      if (isExpiryPast(value)) return "Card has expired";
      return undefined;
    }
    case "cvv": {
      if (!value) return "CVV is required";
      const cardType = detectCardType(formData.cardNumber);
      const requiredLength = cardType === "amex" ? 4 : 3;
      if (!/^\d+$/.test(value)) return "CVV must contain only digits";
      if (value.length !== requiredLength)
        return `CVV must be ${requiredLength} digits${cardType === "amex" ? " for Amex" : ""}`;
      return undefined;
    }
    case "amount": {
      if (!value) return "Amount is required";
      const num = parseFloat(value);
      if (isNaN(num) || num <= 0) return "Amount must be a positive number";
      if (num > 1000000) return "Amount exceeds maximum limit";
      return undefined;
    }
    default:
      return undefined;
  }
}

export function validateForm(formData: PaymentFormData): FormErrors {
  const errors: FormErrors = {};
  const fields: (keyof PaymentFormData)[] = [
    "cardholderName",
    "cardNumber",
    "expiryDate",
    "cvv",
    "amount",
  ];
  for (const field of fields) {
    const error = validateField(field, formData[field], formData);
    if (error) {
      (errors as Record<string, string>)[field] = error;
    }
  }
  return errors;
}

export function isFormValid(formData: PaymentFormData): boolean {
  const errors = validateForm(formData);
  return Object.keys(errors).length === 0;
}

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function maskCardNumber(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, "");
  const last4 = cleaned.slice(-4);
  const masked = cleaned.slice(0, -4).replace(/\d/g, "•");
  const full = masked + last4;

  const cardType = detectCardType(cardNumber);
  if (cardType === "amex") {
    return `${full.slice(0, 4)} ${full.slice(4, 10)} ${full.slice(10)}`;
  }
  return full.replace(/(.{4})/g, "$1 ").trim();
}

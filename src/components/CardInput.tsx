"use client";

import React from "react";
import {
  Box,
  TextField,
  InputAdornment,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid2 as Grid,
  Typography,
} from "@mui/material";
import { CardType, Currency, FormErrors, PaymentFormData } from "@/types";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

interface CardInputProps {
  formData: PaymentFormData;
  errors: FormErrors;
  touched: Partial<Record<keyof PaymentFormData, boolean>>;
  cardType: CardType;
  isSubmitting: boolean;
  onChange: (name: keyof PaymentFormData, value: string) => void;
  onBlur: (name: keyof PaymentFormData) => void;
  onCurrencyChange: (currency: Currency) => void;
}

const cardTypeLabels: Record<CardType, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "American Express",
  unknown: "",
};

const cardTypeColors: Record<CardType, "primary" | "secondary" | "success" | "default"> = {
  visa: "primary",
  mastercard: "secondary",
  amex: "success",
  unknown: "default",
};

export default function CardInput({
  formData,
  errors,
  touched,
  cardType,
  isSubmitting,
  onChange,
  onBlur,
  onCurrencyChange,
}: CardInputProps) {
  const showError = (field: keyof FormErrors) =>
    touched[field] && Boolean(errors[field]);

  const getError = (field: keyof FormErrors) =>
    touched[field] ? errors[field] : undefined;

  return (
    <Box component="fieldset" sx={{ border: "none", p: 0, m: 0 }}>
      <Grid container spacing={2.5}>
        {/* Cardholder Name */}
        <Grid size={12}>
          <TextField
            fullWidth
            size="small"
            
            id="cardholderName"
            name="cardholderName"
            label="Cardholder Name"
            value={formData.cardholderName}
            onChange={(e) => onChange("cardholderName", e.target.value)}
            onBlur={() => onBlur("cardholderName")}
            error={showError("cardholderName")}
            helperText={getError("cardholderName")}
            disabled={isSubmitting}
            autoComplete="cc-name"
            inputProps={{
              "aria-describedby": showError("cardholderName")
                ? "cardholderName-error"
                : undefined,
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon fontSize="small"
                     color="action" />
                  </InputAdornment>
                ),
              },
              formHelperText: {
                id: "cardholderName-error",
                role: "alert",
              },
            }}
            placeholder="John Doe"
          />
        </Grid>

        {/* Card Number */}
        <Grid size={12}>
          <TextField
            fullWidth
            size="small"
            
            id="cardNumber"
            name="cardNumber"
            label="Card Number"
            value={formData.cardNumber}
            onChange={(e) => onChange("cardNumber", e.target.value)}
            onBlur={() => onBlur("cardNumber")}
            error={showError("cardNumber")}
            helperText={getError("cardNumber")}
            disabled={isSubmitting}
            autoComplete="cc-number"
            inputProps={{
              inputMode: "numeric",
              "aria-describedby": showError("cardNumber")
                ? "cardNumber-error"
                : undefined,
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <CreditCardIcon fontSize="small"
                     color="action" />
                  </InputAdornment>
                ),
                endAdornment:
                  cardType !== "unknown" ? (
                    <InputAdornment position="end">
                      <Chip
                        label={cardTypeLabels[cardType]}
                        size="small"
                        
                        color={cardTypeColors[cardType]}
                        sx={{ fontWeight: 600, fontSize: "0.7rem" }}
                      />
                    </InputAdornment>
                  ) : undefined,
              },
              formHelperText: {
                id: "cardNumber-error",
                role: "alert",
              },
            }}
            placeholder="1234 5678 9012 3456"
          />
        </Grid>

        {/* Expiry + CVV */}
        <Grid size={6}>
          <TextField
            fullWidth
            size="small"
            
            id="expiryDate"
            name="expiryDate"
            label="Expiry Date"
            value={formData.expiryDate}
            onChange={(e) => onChange("expiryDate", e.target.value)}
            onBlur={() => onBlur("expiryDate")}
            error={showError("expiryDate")}
            helperText={getError("expiryDate")}
            disabled={isSubmitting}
            autoComplete="cc-exp"
            inputProps={{
              inputMode: "numeric",
              maxLength: 5,
              "aria-describedby": showError("expiryDate")
                ? "expiryDate-error"
                : undefined,
            }}
            slotProps={{
              formHelperText: {
                id: "expiryDate-error",
                role: "alert",
              },
            }}
            placeholder="MM/YY"
          />
        </Grid>

        <Grid size={6}>
          <TextField
            fullWidth
            size="small"
            
            id="cvv"
            name="cvv"
            label={cardType === "amex" ? "CID (4 digits)" : "CVV"}
            value={formData.cvv}
            onChange={(e) => onChange("cvv", e.target.value)}
            onBlur={() => onBlur("cvv")}
            error={showError("cvv")}
            helperText={getError("cvv")}
            disabled={isSubmitting}
            autoComplete="cc-csc"
            type="password"
            inputProps={{
              inputMode: "numeric",
              maxLength: cardType === "amex" ? 4 : 3,
              "aria-describedby": showError("cvv") ? "cvv-error" : undefined,
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon fontSize="small"
                     color="action" />
                  </InputAdornment>
                ),
              },
              formHelperText: {
                id: "cvv-error",
                role: "alert",
              },
            }}
            placeholder={cardType === "amex" ? "1234" : "123"}
          />
        </Grid>

        {/* Amount + Currency */}
        <Grid size={12}>
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
            <FormControl size="small"
             sx={{ minWidth: 110 }} disabled={isSubmitting}>
              <InputLabel id="currency-label">Currency</InputLabel>
              <Select
                labelId="currency-label"
                id="currency"
                value={formData.currency}
                label="Currency"
                onChange={(e) => onCurrencyChange(e.target.value as Currency)}
              >
                <MenuItem value="INR">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2">₹ INR</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="USD">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2">$ USD</Typography>
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              size="small"
              
              id="amount"
              name="amount"
              label="Amount"
              value={formData.amount}
              onChange={(e) => onChange("amount", e.target.value)}
              onBlur={() => onBlur("amount")}
              error={showError("amount")}
              helperText={getError("amount")}
              disabled={isSubmitting}
              inputProps={{
                inputMode: "decimal",
                "aria-describedby": showError("amount")
                  ? "amount-error"
                  : undefined,
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyIcon fontSize="small"
                       color="action" />
                    </InputAdornment>
                  ),
                },
                formHelperText: {
                  id: "amount-error",
                  role: "alert",
                },
              }}
              placeholder="0.00"
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

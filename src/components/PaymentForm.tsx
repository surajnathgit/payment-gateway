"use client";

import React, { useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import SendIcon from "@mui/icons-material/Send";
import CardInput from "./CardInput";
import CardPreview from "./CardPreview";
import StatusScreen from "./StatusScreen";
import { usePayment } from "@/hooks/usePayment";
import { usePaymentForm } from "@/hooks/usePaymentForm";
import { formatCurrency } from "@/utils/cardUtils";

export default function PaymentForm() {
  const {
    status,
    currentTransactionId,
    attemptCount,
    failureReason,
    transactions,
    processPayment,
    handleNewPayment,
    canRetry,
    isMaxRetries,
    maxRetries,
  } = usePayment();

  const {
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
  } = usePaymentForm();

  const isSubmitting = status === "processing";
  const showForm = status === "idle";
  const showStatus = status !== "idle";

  const lastTransaction = currentTransactionId
    ? transactions.find((t) => t.id === currentTransactionId) ?? null
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;
    const txId = getOrCreateTransactionId();
    await processPayment(formData, txId);
  };

  const handleRetry = async () => {
    if (!currentTransactionId) return;
    await processPayment(formData, currentTransactionId);
  };

  const handleStartNewPayment = () => {
    resetForm();
    resetTransactionId();
    handleNewPayment();
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 3,
            py: 2.5,
            background: "linear-gradient(135deg, #1565C0 0%, #1976D2 100%)",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <LockIcon sx={{ color: "rgba(255,255,255,0.9)", fontSize: 20 }} />
          <Typography
            variant="h6"
            sx={{ color: "#fff", fontWeight: 700, fontSize: "1.05rem" }}
          >
            Secure Payment
          </Typography>
          <Box
            sx={{
              ml: "auto",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              bgcolor: "rgba(255,255,255,0.15)",
              borderRadius: 10,
              px: 1.5,
              py: 0.4,
            }}
          >
            <LockIcon sx={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }} />
            <Typography
              variant="caption"
              sx={{ color: "rgba(255,255,255,0.9)", fontWeight: 600, fontSize: "0.65rem" }}
            >
              256-bit SSL
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: 3 }}>
          {showStatus ? (
            <StatusScreen
              status={status}
              failureReason={failureReason}
              attemptCount={attemptCount}
              maxRetries={maxRetries}
              canRetry={canRetry}
              isMaxRetries={isMaxRetries}
              lastTransaction={lastTransaction}
              onRetry={handleRetry}
              onNewPayment={handleStartNewPayment}
            />
          ) : (
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              aria-label="Payment form"
            >
              {/* Card Preview */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 3,
                }}
              >
                <CardPreview formData={formData} cardType={cardType} />
              </Box>

              <Divider sx={{ mb: 3 }}>
                <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
                  Enter Card Details
                </Typography>
              </Divider>

              <CardInput
                formData={formData}
                errors={errors}
                touched={touched}
                cardType={cardType}
                isSubmitting={isSubmitting}
                onChange={handleChange}
                onBlur={handleBlur}
                onCurrencyChange={handleCurrencyChange}
              />

              <Box sx={{ mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={!isValid || isSubmitting}
                  startIcon={<SendIcon />}
                  aria-disabled={!isValid || isSubmitting}
                  sx={{
                    py: 1.6,
                    fontWeight: 700,
                    fontSize: "1rem",
                    background:
                      isValid && !isSubmitting
                        ? "linear-gradient(135deg, #1565C0 0%, #1976D2 100%)"
                        : undefined,
                    transition: "all 0.2s ease",
                  }}
                >
                  {isSubmitting
                    ? "Processing…"
                    : formData.amount && isValid
                    ? `Pay ${formatCurrency(parseFloat(formData.amount) || 0, formData.currency)}`
                    : "Pay Now"}
                </Button>
              </Box>

              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.8,
                  opacity: 0.6,
                }}
              >
                <LockIcon sx={{ fontSize: 12 }} />
                <Typography variant="caption" color="text.secondary">
                  Your payment is protected with end-to-end encryption
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
}

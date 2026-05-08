"use client";

import React, { useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Divider,
  LinearProgress,
  Chip,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ReplayIcon from "@mui/icons-material/Replay";
import AddCardIcon from "@mui/icons-material/AddCard";
import { PaymentStatus, Transaction } from "@/types";
import { formatCurrency } from "@/utils/cardUtils";

interface StatusScreenProps {
  status: PaymentStatus;
  failureReason: string | null;
  attemptCount: number;
  maxRetries: number;
  canRetry: boolean;
  isMaxRetries: boolean;
  lastTransaction: Transaction | null;
  onRetry: () => void;
  onNewPayment: () => void;
}

function ProcessingState() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 4,
        gap: 3,
      }}
      role="status"
      aria-label="Processing payment"
      aria-live="polite"
    >
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress size={72} thickness={3} color="primary" />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AddCardIcon sx={{ fontSize: 28, color: "primary.main", opacity: 0.7 }} />
        </Box>
      </Box>
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Processing Payment
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please wait while we securely process your transaction…
        </Typography>
      </Box>
      <Box sx={{ width: "100%" }}>
        <LinearProgress
          sx={{ borderRadius: 4, height: 6 }}
          aria-label="Payment processing progress"
        />
      </Box>
      <Alert severity="info" variant="outlined" sx={{ width: "100%" }}>
        Do not close or refresh this page.
      </Alert>
    </Box>
  );
}

function SuccessState({
  transaction,
  onNewPayment,
}: {
  transaction: Transaction | null;
  onNewPayment: () => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    buttonRef.current?.focus();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 3,
        gap: 2.5,
      }}
      role="status"
      aria-live="polite"
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          bgcolor: "success.light",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "pulse 1.5s ease-in-out",
          "@keyframes pulse": {
            "0%": { transform: "scale(0.8)", opacity: 0 },
            "50%": { transform: "scale(1.05)" },
            "100%": { transform: "scale(1)", opacity: 1 },
          },
        }}
      >
        <CheckCircleOutlineIcon sx={{ fontSize: 48, color: "success.dark" }} />
      </Box>

      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h5" fontWeight={700} color="success.dark" gutterBottom>
          Payment Successful!
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your transaction was completed successfully.
        </Typography>
      </Box>

      {transaction && (
        <Box
          sx={{
            width: "100%",
            bgcolor: "success.50",
            border: "1px solid",
            borderColor: "success.200",
            borderRadius: 2,
            p: 2.5,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
            <Typography variant="body2" color="text.secondary">
              Amount Paid
            </Typography>
            <Typography variant="body1" fontWeight={700} color="success.dark">
              {formatCurrency(transaction.amount, transaction.currency)}
            </Typography>
          </Box>
          <Divider sx={{ my: 1.5 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Transaction ID
            </Typography>
            <Typography
              variant="body2"
              fontFamily="monospace"
              sx={{ fontSize: "0.75rem", wordBreak: "break-all", textAlign: "right", maxWidth: "55%" }}
            >
              {transaction.id}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Card
            </Typography>
            <Typography variant="body2">
              ••••{" "}{transaction.cardLast4}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              Time
            </Typography>
            <Typography variant="body2">
              {new Date(transaction.timestamp).toLocaleString()}
            </Typography>
          </Box>
        </Box>
      )}

      <Button
        ref={buttonRef}
        variant="contained"
        fullWidth
        size="large"
        startIcon={<AddCardIcon />}
        onClick={onNewPayment}
        sx={{ mt: 1 }}
      >
        Make Another Payment
      </Button>
    </Box>
  );
}

function FailureState({
  status,
  failureReason,
  attemptCount,
  maxRetries,
  canRetry,
  isMaxRetries,
  transaction,
  onRetry,
  onNewPayment,
}: {
  status: "failed" | "timeout";
  failureReason: string | null;
  attemptCount: number;
  maxRetries: number;
  canRetry: boolean;
  isMaxRetries: boolean;
  transaction: Transaction | null;
  onRetry: () => void;
  onNewPayment: () => void;
}) {
  const retryButtonRef = useRef<HTMLButtonElement>(null);
  const isTimeout = status === "timeout";

  useEffect(() => {
    retryButtonRef.current?.focus();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 3,
        gap: 2.5,
      }}
      role="alert"
      aria-live="assertive"
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          bgcolor: isTimeout ? "warning.light" : "error.light",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isTimeout ? (
          <AccessTimeIcon sx={{ fontSize: 48, color: "warning.dark" }} />
        ) : (
          <ErrorOutlineIcon sx={{ fontSize: 48, color: "error.dark" }} />
        )}
      </Box>

      <Box sx={{ textAlign: "center" }}>
        <Typography
          variant="h5"
          fontWeight={700}
          color={isTimeout ? "warning.dark" : "error.dark"}
          gutterBottom
        >
          {isTimeout ? "Request Timed Out" : "Payment Failed"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {failureReason ?? (isTimeout ? "Connection took too long." : "Transaction could not be completed.")}
        </Typography>
      </Box>

      {!isMaxRetries && (
        <Chip
          label={`Attempt ${attemptCount} of ${maxRetries}`}
          color={canRetry ? "warning" : "error"}
          variant="outlined"
          size="small"
        />
      )}

      {transaction && (
        <Box
          sx={{
            width: "100%",
            bgcolor: isTimeout ? "warning.50" : "error.50",
            border: "1px solid",
            borderColor: isTimeout ? "warning.200" : "error.200",
            borderRadius: 2,
            p: 2,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Amount
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {formatCurrency(transaction.amount, transaction.currency)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              Transaction ID
            </Typography>
            <Typography
              variant="body2"
              fontFamily="monospace"
              sx={{ fontSize: "0.7rem", wordBreak: "break-all", textAlign: "right", maxWidth: "55%" }}
            >
              {transaction.id}
            </Typography>
          </Box>
        </Box>
      )}

      {isMaxRetries && (
        <Alert severity="error" variant="filled" sx={{ width: "100%" }}>
          Maximum retry attempts reached. Please start a new payment.
        </Alert>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, width: "100%" }}>
        {canRetry && (
          <Button
            ref={retryButtonRef}
            variant="contained"
            fullWidth
            size="large"
            startIcon={<ReplayIcon />}
            onClick={onRetry}
            color={isTimeout ? "warning" : "error"}
          >
            Retry Payment (Attempt {attemptCount + 1} of {maxRetries})
          </Button>
        )}
        <Button
          ref={!canRetry ? retryButtonRef : undefined}
          variant={canRetry ? "outlined" : "contained"}
          fullWidth
          size="large"
          startIcon={<AddCardIcon />}
          onClick={onNewPayment}
        >
          New Payment
        </Button>
      </Box>
    </Box>
  );
}

export default function StatusScreen({
  status,
  failureReason,
  attemptCount,
  maxRetries,
  canRetry,
  isMaxRetries,
  lastTransaction,
  onRetry,
  onNewPayment,
}: StatusScreenProps) {
  if (status === "processing") {
    return <ProcessingState />;
  }

  if (status === "success") {
    return (
      <SuccessState transaction={lastTransaction} onNewPayment={onNewPayment} />
    );
  }

  if (status === "failed" || status === "timeout") {
    return (
      <FailureState
        status={status}
        failureReason={failureReason}
        attemptCount={attemptCount}
        maxRetries={maxRetries}
        canRetry={canRetry}
        isMaxRetries={isMaxRetries}
        transaction={lastTransaction}
        onRetry={onRetry}
        onNewPayment={onNewPayment}
      />
    );
  }

  return null;
}

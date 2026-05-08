"use client";

import React from "react";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Paper,
  IconButton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CloseIcon from "@mui/icons-material/Close";
import HistoryIcon from "@mui/icons-material/History";
import { Transaction } from "@/types";
import { formatCurrency } from "@/utils/cardUtils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSelectedTransaction } from "@/store/paymentSlice";

const statusConfig = {
  success: { color: "success" as const, icon: <CheckCircleIcon fontSize="small" />, label: "Success" },
  failed: { color: "error" as const, icon: <ErrorIcon fontSize="small" />, label: "Failed" },
  timeout: { color: "warning" as const, icon: <AccessTimeIcon fontSize="small" />, label: "Timeout" },
};

interface TransactionDetailDialogProps {
  transaction: Transaction | null;
  onClose: () => void;
}

function TransactionDetailDialog({ transaction, onClose }: TransactionDetailDialogProps) {
  if (!transaction) return null;

  const config = statusConfig[transaction.status];

  return (
    <Dialog
      open={Boolean(transaction)}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      aria-labelledby="transaction-detail-title"
    >
      <DialogTitle id="transaction-detail-title">
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight={600}>
            Transaction Details
          </Typography>
          <IconButton onClick={onClose} size="small" aria-label="Close dialog">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Chip
            icon={config.icon}
            label={config.label}
            color={config.color}
            variant="filled"
            sx={{ fontWeight: 600, px: 1 }}
          />
        </Box>

        {[
          { label: "Transaction ID", value: transaction.id, mono: true },
          { label: "Amount", value: formatCurrency(transaction.amount, transaction.currency) },
          { label: "Cardholder", value: transaction.cardholderName },
          { label: "Card", value: `${transaction.cardType.toUpperCase()} ••••${transaction.cardLast4}` },
          { label: "Attempts", value: `${transaction.attemptCount}` },
          {
            label: "Date & Time",
            value: new Date(transaction.timestamp).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            }),
          },
          ...(transaction.failureReason
            ? [{ label: "Failure Reason", value: transaction.failureReason, highlight: true }]
            : []),
        ].map(({ label, value, mono, highlight }) => (
          <Box key={label} sx={{ mb: 1.5 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              {label}
            </Typography>
            <Typography
              variant="body2"
              fontFamily={mono ? "monospace" : undefined}
              color={highlight ? "error.main" : "text.primary"}
              sx={{
                wordBreak: "break-all",
                fontWeight: highlight ? 600 : 400,
                fontSize: mono ? "0.72rem" : undefined,
              }}
            >
              {value}
            </Typography>
          </Box>
        ))}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained" fullWidth>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export default function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const dispatch = useAppDispatch();
  const selectedTransaction = useAppSelector((s) => s.payment.selectedTransaction);

  const handleSelect = (transaction: Transaction) => {
    dispatch(setSelectedTransaction(transaction));
  };

  const handleClose = () => {
    dispatch(setSelectedTransaction(null));
  };

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          px: 2.5,
          py: 2,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "grey.50",
        }}
      >
        <HistoryIcon fontSize="small" color="action" />
        <Typography variant="subtitle1" fontWeight={600}>
          Transaction History
        </Typography>
        {transactions.length > 0 && (
          <Chip
            label={transactions.length}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ ml: "auto", fontWeight: 600 }}
          />
        )}
      </Box>

      {transactions.length === 0 ? (
        <Box sx={{ py: 5, textAlign: "center" }}>
          <HistoryIcon sx={{ fontSize: 40, color: "text.disabled", mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            No transactions yet
          </Typography>
        </Box>
      ) : (
        <List disablePadding>
          {transactions.map((tx, idx) => {
            const config = statusConfig[tx.status];
            return (
              <React.Fragment key={tx.id}>
                {idx > 0 && <Divider component="li" />}
                <ListItemButton
                  onClick={() => handleSelect(tx)}
                  sx={{
                    px: 2.5,
                    py: 1.5,
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                  aria-label={`Transaction ${tx.id.slice(-8)}, ${config.label}, ${formatCurrency(tx.amount, tx.currency)}`}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Box sx={{ color: `${config.color}.main` }}>{config.icon}</Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="body2" fontFamily="monospace" fontSize="0.8rem">
                          …{tx.id.slice(-8)}
                        </Typography>
                        <Chip
                          label={config.label}
                          size="small"
                          color={config.color}
                          variant="outlined"
                          sx={{ height: 18, fontSize: "0.65rem", fontWeight: 600 }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box
                        component="span"
                        sx={{ display: "flex", justifyContent: "space-between", mt: 0.3 }}
                      >
                        <Typography variant="caption" color="text.secondary" component="span">
                          {new Date(tx.timestamp).toLocaleString("en-IN", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </Typography>
                        <Typography
                          variant="caption"
                          fontWeight={600}
                          color="text.primary"
                          component="span"
                        >
                          {formatCurrency(tx.amount, tx.currency)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItemButton>
              </React.Fragment>
            );
          })}
        </List>
      )}

      <TransactionDetailDialog
        transaction={selectedTransaction}
        onClose={handleClose}
      />
    </Paper>
  );
}

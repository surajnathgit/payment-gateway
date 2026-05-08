"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { CardType, PaymentFormData } from "@/types";
import { maskCardNumber } from "@/utils/cardUtils";

interface CardPreviewProps {
  formData: PaymentFormData;
  cardType: CardType;
}

function CardLogo({ cardType }: { cardType: CardType }) {
  if (cardType === "visa") {
    return (
      <Typography
        sx={{
          fontFamily: "'Ultramagnetic', 'Arial Black', sans-serif",
          fontSize: "1.6rem",
          fontWeight: 900,
          fontStyle: "italic",
          color: "#fff",
          letterSpacing: "-1px",
          lineHeight: 1,
          textShadow: "0 1px 4px rgba(0,0,0,0.3)",
        }}
      >
        VISA
      </Typography>
    );
  }
  if (cardType === "mastercard") {
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box
          sx={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            bgcolor: "#EB001B",
            opacity: 0.9,
          }}
        />
        <Box
          sx={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            bgcolor: "#F79E1B",
            opacity: 0.9,
            ml: "-12px",
          }}
        />
      </Box>
    );
  }
  if (cardType === "amex") {
    return (
      <Typography
        sx={{
          fontSize: "0.65rem",
          fontWeight: 800,
          color: "#fff",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          border: "2px solid rgba(255,255,255,0.8)",
          px: 0.8,
          py: 0.2,
          borderRadius: "2px",
          lineHeight: 1.3,
        }}
      >
        AMEX
      </Typography>
    );
  }
  return (
    <Box
      sx={{
        width: 34,
        height: 24,
        borderRadius: "4px",
        border: "1px solid rgba(255,255,255,0.3)",
        background: "rgba(255,255,255,0.1)",
      }}
    />
  );
}

function ChipIcon() {
  return (
    <Box
      sx={{
        width: 42,
        height: 32,
        borderRadius: "5px",
        background: "linear-gradient(135deg, #d4a843 0%, #f0c060 40%, #c89030 60%, #e8b840 100%)",
        border: "1px solid rgba(0,0,0,0.2)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          height: "1px",
          background: "rgba(0,0,0,0.2)",
          transform: "translateY(-50%)",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          left: "50%",
          top: 0,
          bottom: 0,
          width: "1px",
          background: "rgba(0,0,0,0.2)",
          transform: "translateX(-50%)",
        },
      }}
    />
  );
}

export default function CardPreview({ formData, cardType }: CardPreviewProps) {
  const displayNumber =
    formData.cardNumber
      ? maskCardNumber(formData.cardNumber)
      : cardType === "amex"
      ? "•••• •••••• •••••"
      : "•••• •••• •••• ••••";

  const displayName = formData.cardholderName.trim() || "CARD HOLDER NAME";
  const displayExpiry = formData.expiryDate || "MM/YY";

  const gradientMap: Record<CardType, string> = {
    visa: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    mastercard: "linear-gradient(135deg, #1c1c1c 0%, #2d2d2d 50%, #1a1a1a 100%)",
    amex: "linear-gradient(135deg, #006747 0%, #009466 50%, #004d33 100%)",
    unknown: "linear-gradient(135deg, #2c3e50 0%, #3d5166 50%, #243342 100%)",
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 400,
        aspectRatio: "1.586 / 1",
        borderRadius: "16px",
        background: gradientMap[cardType],
        boxShadow: "0 20px 60px rgba(0,0,0,0.35), 0 6px 20px rgba(0,0,0,0.25)",
        p: 3,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
        transition: "background 0.5s ease",
        "&::before": {
          content: '""',
          position: "absolute",
          top: "-50%",
          right: "-20%",
          width: "60%",
          height: "200%",
          background: "radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: "-30%",
          left: "-10%",
          width: "70%",
          height: "100%",
          background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        },
      }}
    >
      {/* Top row */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <ChipIcon />
        <CardLogo cardType={cardType} />
      </Box>

      {/* Card Number */}
      <Typography
        sx={{
          fontFamily: "'Courier New', 'Courier', monospace",
          fontSize: { xs: "1.1rem", sm: "1.3rem" },
          letterSpacing: "0.18em",
          color: "#fff",
          textShadow: "0 1px 4px rgba(0,0,0,0.4)",
          transition: "all 0.2s ease",
          mt: 1,
        }}
      >
        {displayNumber}
      </Typography>

      {/* Bottom row */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <Box>
          <Typography
            sx={{
              fontSize: "0.6rem",
              color: "rgba(255,255,255,0.6)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              mb: 0.3,
            }}
          >
            Card Holder
          </Typography>
          <Typography
            sx={{
              fontSize: "0.85rem",
              color: "#fff",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontWeight: 500,
              maxWidth: 180,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              transition: "all 0.2s ease",
            }}
          >
            {displayName}
          </Typography>
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Typography
            sx={{
              fontSize: "0.6rem",
              color: "rgba(255,255,255,0.6)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              mb: 0.3,
            }}
          >
            Expires
          </Typography>
          <Typography
            sx={{
              fontSize: "0.85rem",
              color: "#fff",
              letterSpacing: "0.12em",
              fontWeight: 500,
              transition: "all 0.2s ease",
            }}
          >
            {displayExpiry}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

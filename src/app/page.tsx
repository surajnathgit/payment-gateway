import { Box, Typography, Container } from "@mui/material";
import PaymentForm from "@/components/PaymentForm";
import TransactionHistory from "@/components/TransactionHistory";
import HydrateStore from "@/components/HydrateStore";
import TransactionHistoryWrapper from "@/components/TransactionHistoryWrapper";

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "white",
        py: { xs: 3, md: 5 },
      }}
    >
      <HydrateStore />
      <Container maxWidth="lg">
        {/* Page Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 500,
              color: "primary.dark",
              letterSpacing: "-0.02em",
              mb: 0.5,
            }}
          >
           SoluLab SecurePay
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Fast, secure, and reliable payment processing
          </Typography>
        </Box>

        {/* Main layout: form + history side by side on desktop */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
            gap: 3,
            alignItems: "start",
          }}
        >
          {/* Payment Form */}
          <Box>
            <PaymentForm />
          </Box>

          {/* Transaction History */}
          <Box>
            <TransactionHistoryWrapper />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

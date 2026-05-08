import { GatewayResponse, PaymentPayload } from "@/types";

const TIMEOUT_MS = 6000;

export async function submitPayment(
  payload: PaymentPayload
): Promise<GatewayResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch("/api/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ failureReason: "Network error. Please try again." }));
      return {
        success: false,
        transactionId: payload.transactionId,
        failureReason:
          (errorData as { failureReason?: string }).failureReason ??
          "Payment failed. Please try again.",
      };
    }

    const data = (await response.json()) as GatewayResponse;
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("TIMEOUT");
    }
    throw new Error("NETWORK_ERROR");
  }
}

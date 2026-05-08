import { NextRequest, NextResponse } from "next/server";
import { GatewayResponse, PaymentPayload } from "@/types";

const FAILURE_REASONS = [
  "Insufficient funds",
  "Card declined",
  "Invalid card details",
  "Transaction limit exceeded",
];

function getRandomFailureReason(): string {
  return FAILURE_REASONS[Math.floor(Math.random() * FAILURE_REASONS.length)];
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as PaymentPayload;
    const { transactionId } = body;

    const rand = Math.random();

    // ~15% timeout (responds after 8s, frontend cancels at 6s)
    if (rand < 0.15) {
      await sleep(8000);
      const response: GatewayResponse = {
        success: false,
        transactionId,
        failureReason: "Gateway timeout",
      };
      return NextResponse.json(response);
    }

    // ~25% failure (rand between 0.15 and 0.40)
    if (rand < 0.40) {
      await sleep(1500);
      const response: GatewayResponse = {
        success: false,
        transactionId,
        failureReason: getRandomFailureReason(),
      };
      return NextResponse.json(response);
    }

    // ~60% success
    await sleep(1500);
    const response: GatewayResponse = {
      success: true,
      transactionId,
    };
    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      {
        success: false,
        transactionId: "",
        failureReason: "Internal server error",
      } satisfies GatewayResponse,
      { status: 500 }
    );
  }
}

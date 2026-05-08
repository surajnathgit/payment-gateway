"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { hydrateTransactions } from "@/store/paymentSlice";

export default function HydrateStore() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(hydrateTransactions());
  }, [dispatch]);

  return null;
}

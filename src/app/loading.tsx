"use client";

import { CircularProgress } from "@heroui/react";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <CircularProgress
        aria-label="Loading..."
        color="primary"
        size="lg"
      />
    </div>
  );
}

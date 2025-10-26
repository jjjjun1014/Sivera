"use client";

import { useState } from "react";
import { SplashScreen } from "./SplashScreen";

export function SplashProvider({ children }: { children: React.ReactNode }) {
  const [splashComplete, setSplashComplete] = useState(false);

  return (
    <>
      <SplashScreen onComplete={() => setSplashComplete(true)} skipOnRevisit={true} />
      {children}
    </>
  );
}

/**
 * Platform OAuth Card Component
 * 플랫폼 연동 카드
 */

import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import type { PlatformType } from "@/contexts/AccountContext";
import { PLATFORM_NAME, PLATFORM_COLOR } from "@/lib/constants/team";

interface PlatformOAuthCardProps {
  platform: PlatformType;
  description: string;
  onConnect: () => void;
  isConnected?: boolean;
}

const platformLetters: Record<PlatformType, string> = {
  google: "G",
  meta: "M",
  tiktok: "T",
  amazon: "A",
};

export function PlatformOAuthCard({
  platform,
  description,
  onConnect,
  isConnected = false,
}: PlatformOAuthCardProps) {
  const color = PLATFORM_COLOR[platform];
  const colorClass = {
    primary: "bg-primary/10",
    secondary: "bg-secondary/10",
    warning: "bg-warning/10",
    danger: "bg-danger/10",
  }[color];

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardBody className="text-center py-8">
        <div className={`w-16 h-16 ${colorClass} rounded-lg mx-auto mb-4 flex items-center justify-center`}>
          <span className="text-3xl font-bold">{platformLetters[platform]}</span>
        </div>
        <h4 className="text-lg font-semibold mb-2">{PLATFORM_NAME[platform]}</h4>
        <p className="text-sm text-default-500 mb-4">{description}</p>
        <Button
          color={isConnected ? "success" : "primary"}
          variant={isConnected ? "flat" : "bordered"}
          radius="sm"
          fullWidth
          onPress={onConnect}
        >
          {isConnected ? "연동됨" : "연동하기"}
        </Button>
      </CardBody>
    </Card>
  );
}

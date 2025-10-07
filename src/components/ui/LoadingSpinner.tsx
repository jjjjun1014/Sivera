import { Spinner } from "@heroui/spinner";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({
  size = "lg",
  label = "로딩 중...",
  fullScreen = false,
}: LoadingSpinnerProps) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-4">
          <Spinner size={size} color="primary" />
          {label && <p className="text-default-600">{label}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <Spinner size={size} color="primary" />
      {label && <p className="text-default-600">{label}</p>}
    </div>
  );
}

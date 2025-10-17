import { toast as sonnerToast } from "sonner";
import log from "@/utils/logger";

interface ToastOptions {
  title: string;
  description?: string;
  duration?: number;
}

export const toast = {
  success: (options: ToastOptions) => {
    log.info("Toast success:", { message: options.title });
    sonnerToast.success(options.title, {
      description: options.description,
      duration: options.duration || 4000,
    });
  },

  error: (options: ToastOptions) => {
    log.error("Toast error:", { message: options.title });
    sonnerToast.error(options.title, {
      description: options.description,
      duration: options.duration || 6000,
    });
  },

  warning: (options: ToastOptions) => {
    log.warn("Toast warning:", { message: options.title });
    sonnerToast.warning(options.title, {
      description: options.description,
      duration: options.duration || 5000,
    });
  },

  info: (options: ToastOptions) => {
    log.info("Toast info:", { message: options.title });
    sonnerToast.info(options.title, {
      description: options.description,
      duration: options.duration || 4000,
    });
  },

  promise: async <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    },
  ): Promise<T> => {
    return sonnerToast.promise(promise, {
      loading: messages.loading,
      success: (data) =>
        typeof messages.success === "function"
          ? messages.success(data)
          : messages.success,
      error: (error) =>
        typeof messages.error === "function"
          ? messages.error(
              error instanceof Error ? error : new Error(String(error)),
            )
          : messages.error,
    });
  },
};

export const showToast = toast;

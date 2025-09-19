import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from '@/hooks/use-translation';

interface ApiErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  fallbackMessage?: string;
  onError?: (error: unknown) => void;
}

export const useApiErrorHandler = () => {
  const { t } = useTranslation();

  const handleApiError = useCallback((
    error: unknown,
    options: ApiErrorHandlerOptions = {}
  ) => {
    const {
      showToast = true,
      logError = true,
      fallbackMessage = 'common.error',
      onError
    } = options;

    // Log the error for debugging
    if (logError) {
      console.error('API Error:', error);
    }

    // Extract error message
    let errorMessage = fallbackMessage;
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    // Show toast notification
    if (showToast) {
      toast.error(t(errorMessage as any) || errorMessage);
    }

    // Call custom error handler if provided
    if (onError) {
      onError(error);
    }

    return errorMessage;
  }, [t]);

  const withErrorHandling = useCallback(async <T>(
    apiCall: () => Promise<T>,
    options: ApiErrorHandlerOptions = {}
  ): Promise<T | null> => {
    try {
      return await apiCall();
    } catch (error) {
      handleApiError(error, options);
      return null;
    }
  }, [handleApiError]);

  return {
    handleApiError,
    withErrorHandling
  };
};
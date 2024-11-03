export const handleError = (
  message: string,
  setError: (msg: string | null) => void
) => {
  setError(message);
};

export const displayError = (error: unknown, defaultMessage: string) => {
  return error instanceof Error ? error.message : defaultMessage;
};

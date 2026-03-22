export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null) {
    const err = error as Record<string, unknown>;

    // Axios error shape
    if (err.response && typeof err.response === "object") {
      const data = (err.response as Record<string, unknown>).data;
      if (typeof data === "object" && data !== null) {
        const detail = (data as Record<string, unknown>).detail;
        if (typeof detail === "string") return detail;
        if (Array.isArray(detail) && detail.length > 0) {
          return detail.map((d) => d.msg ?? JSON.stringify(d)).join(", ");
        }
      }
    }

    if (typeof err.message === "string") return err.message;
  }
  if (typeof error === "string") return error;
  return "An unexpected error occurred";
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

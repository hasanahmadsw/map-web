/* eslint-disable @typescript-eslint/no-explicit-any */

export const toQS = (params: Record<string, any> = {}): string => {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== "" && v.length !== 0,
  );
  return entries.length ? `?${new URLSearchParams(entries as any).toString()}` : "";
};

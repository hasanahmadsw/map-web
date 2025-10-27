"use client";

import { useRouter } from "next/navigation";
import { EmptyState } from "./empty-state";

interface EmptyStateWrapperProps {
  title?: string;
  description?: string;
  buttonText?: string;
}

export function EmptyStateWrapper({ title, description, buttonText }: EmptyStateWrapperProps) {
  const router = useRouter();

  const onClearFilters = () => {
    const params = new URLSearchParams();
    router.push(`?${params.toString()}`);
  };

  return (
    <EmptyState
      title={title || ""}
      description={description || ""}
      buttonText={buttonText || ""}
      onClearFilters={onClearFilters}
    />
  );
}

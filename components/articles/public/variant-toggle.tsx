"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/providers/translations-provider";

export enum ViewVariant {
  VERTICAL = "vertical",
  HORIZONTAL = "horizontal",
}

interface VariantToggleProps {
  defaultVariant?: ViewVariant;
  onVariantChange?: (variant: ViewVariant) => void;
}

export function VariantToggle({ defaultVariant = ViewVariant.VERTICAL, onVariantChange }: VariantToggleProps) {
  const { t } = useTranslation();
  const [selectedVariant, setSelectedVariant] = useState<ViewVariant>(defaultVariant);

  const handleVariantChange = (variant: ViewVariant) => {
    setSelectedVariant(variant);
    onVariantChange?.(variant);
  };

  return (
    <div className="flex justify-end mb-6">
      <div className="flex gap-2">
        <Button
          variant={selectedVariant === ViewVariant.VERTICAL ? "default" : "outline"}
          size="sm"
          onClick={() => handleVariantChange(ViewVariant.VERTICAL)}
          aria-pressed={selectedVariant === ViewVariant.VERTICAL}
        >
          {t.common.grid}
        </Button>
        <Button
          variant={selectedVariant === ViewVariant.HORIZONTAL ? "default" : "outline"}
          size="sm"
          onClick={() => handleVariantChange(ViewVariant.HORIZONTAL)}
          aria-pressed={selectedVariant === ViewVariant.HORIZONTAL}
        >
          {t.common.list}
        </Button>
      </div>
    </div>
  );
}

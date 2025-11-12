"use client";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { cn } from "@/lib/utils";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useTranslation } from "@/providers/translations-provider";

interface ApiErrorProps {
  errorMessage?: string;
  refetchFunction?: () => void;
  buttonContainerClassName?: string;
}

function ApiError({ errorMessage, refetchFunction, buttonContainerClassName }: ApiErrorProps) {
  const { t: translations } = useTranslation();

  return (
    <Alert variant="destructive" className="mb-4 space-y-2 !gap-y-0">
      <AlertTriangle className="mt-[2px] !h-4.5 !w-4.5" />
      <AlertTitle className="!text-base !font-medium">{translations.common.error}</AlertTitle>
      <AlertDescription className="!text-base">{errorMessage}</AlertDescription>

      {refetchFunction && (
        <div
          className={cn(
            buttonContainerClassName,
            "text-primary col-span-2 flex w-full items-center justify-center",
          )}
        >
          <Button variant="outline" onClick={refetchFunction} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            {translations.action.tryAgain}
          </Button>
        </div>
      )}
    </Alert>
  );
}
export default ApiError;

"use client";

import { Loader2 } from "lucide-react";
import type React from "react";
import { type ReactNode, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";

interface FormDialogProps {
  trigger: ReactNode;
  title: string;
  description?: string;
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => Promise<void> | void;
  submitLabel: string;
  cancelLabel?: string;
  isLoading?: boolean;
  loadingLabel?: string;
  className?: string;
  maxWidth?: string;
  form?: UseFormReturn<any>;
  onOpenChange?: (open: boolean) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function FormDialog({
  trigger,
  title,
  description,
  children,
  onSubmit,
  submitLabel,
  cancelLabel = "Cancel",
  isLoading = false,
  loadingLabel,
  className,
  maxWidth = "sm:max-w-[425px]",
  form,
  open,
  setOpen,
  onOpenChange: externalOnOpenChange,
}: FormDialogProps) {

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen && form) {
      form.reset();
    }
    externalOnOpenChange?.(newOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      await onSubmit(e);
        // setOpen(false);
    } catch (error) {
      // Don't close dialog on error, let the error be handled by the form
      console.error("Form submission error:", error);
    }
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className={`${maxWidth} ${className || ""} `}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {form ? (
          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-4">
              {children}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isLoading}>
                  {cancelLabel}
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? loadingLabel || "Loading..." : submitLabel}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {children}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isLoading}>
                {cancelLabel}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? loadingLabel || "Loading..." : submitLabel}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { Loader2, type LucideIcon } from 'lucide-react';
import { type ComponentProps } from 'react';

interface LoadingButtonProps extends Omit<ComponentProps<typeof Button>, 'children' | 'icon'> {
  isLoading: boolean;
  loadingText: string;
  defaultText: string;
  icon?: LucideIcon;
}

export function LoadingButton({
  isLoading,
  loadingText,
  defaultText,
  icon: Icon,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <Button type={props.type || 'submit'} disabled={isLoading || disabled} {...props}>
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        Icon && <Icon className="mr-2 h-4 w-4" />
      )}
      {isLoading ? loadingText : defaultText}
    </Button>
  );
}

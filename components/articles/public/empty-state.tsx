"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  title: string;
  description: string;
  buttonText: string;
  onClearFilters?: () => void;
}

export function EmptyState({ title, description, buttonText, onClearFilters }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground mb-4">{description}</p>
          {onClearFilters && (
            <Button variant="outline" onClick={onClearFilters}>
              {buttonText}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import HtmlViewer from '@/components/shared/html-viewer';

interface EquipmentDescriptionProps {
  description: string;
}

function EquipmentDescription({ description }: EquipmentDescriptionProps) {
  if (!description) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Description</CardTitle>
      </CardHeader>
      <CardContent>
        <HtmlViewer content={description} />
      </CardContent>
    </Card>
  );
}

export default EquipmentDescription;

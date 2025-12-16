'use client';

import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TextInput } from '@/components/shared/input/TextInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BarChart3, Check, X } from 'lucide-react';
import { useState } from 'react';

export function AnalyticsSection() {
  const { control, watch, setValue } = useFormContext();
  const customScripts = watch('analytics.customScripts') || [];
  const [newAnalyticsScript, setNewAnalyticsScript] = useState('');

  const addAnalyticsScript = () => {
    if (newAnalyticsScript.trim()) {
      setValue('analytics.customScripts', [...customScripts, newAnalyticsScript.trim()]);
      setNewAnalyticsScript('');
    }
  };

  const removeAnalyticsScript = (index: number) => {
    setValue(
      'analytics.customScripts',
      customScripts.filter((_: any, i: number) => i !== index),
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <TextInput
            control={control}
            name="analytics.googleAnalytics"
            label="Google Analytics"
            placeholder="GA-XXXXXXXXX"
          />
          <TextInput
            control={control}
            name="analytics.facebookPixel"
            label="Facebook Pixel"
            placeholder="FB-XXXXXXXXX"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="analyticsScripts">Analytics Custom Scripts</Label>
          <div className="flex gap-2">
            <Input
              value={newAnalyticsScript}
              onChange={e => setNewAnalyticsScript(e.target.value)}
              placeholder="console.log('Analytics loaded')"
            />
            <Button type="button" onClick={addAnalyticsScript} variant="outline">
              <Check className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {customScripts.map((script: string, index: number) => (
              <div key={index} className="flex items-center justify-between rounded border p-2">
                <code className="text-xs">{script}</code>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeAnalyticsScript(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

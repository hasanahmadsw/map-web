'use client';

import { useFormContext } from 'react-hook-form';
import { TextInput } from '@/components/shared/input/TextInput';
import { TextAreaInput } from '@/components/shared/input/TextAreaInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Plus } from 'lucide-react';
import { useState } from 'react';

export function MetaInformationSection() {
  const { control, watch, setValue } = useFormContext();
  const keywords = watch('meta.keywords') || [];
  const [newKeyword, setNewKeyword] = useState('');

  const addKeyword = () => {
    const keyword = newKeyword.trim();
    if (keyword && !keywords.includes(keyword)) {
      setValue('meta.keywords', [...keywords, keyword]);
      setNewKeyword('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setValue(
      'meta.keywords',
      keywords.filter((k: string) => k !== keyword),
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meta Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextInput control={control} name="meta.title" label="Meta Title" placeholder="Enter meta title" />
        </div>
        <TextAreaInput
          control={control}
          name="meta.description"
          label="Meta Description"
          placeholder="Enter meta description"
          rows={3}
        />
        <div className="space-y-2">
          <Label htmlFor="keywords">Keywords</Label>
          <div className="flex gap-2">
            <Input
              id="keywords"
              value={newKeyword}
              onChange={e => setNewKeyword(e.target.value)}
              placeholder="Add keyword"
              onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
              className="flex-1"
            />
            <Button type="button" onClick={addKeyword} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {keywords.map((keyword: string) => (
              <Badge key={keyword} variant="secondary" className="flex items-center gap-1 text-xs">
                {keyword}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="hover:bg-destructive/20 h-4 w-4 p-0"
                  onClick={() => removeKeyword(keyword)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

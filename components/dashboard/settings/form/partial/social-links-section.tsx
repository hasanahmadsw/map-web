'use client';

import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TextInput } from '@/components/shared/input/TextInput';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, Plus, X } from 'lucide-react';
import { useState } from 'react';

export function SocialLinksSection() {
  const { watch, setValue } = useFormContext();
  const social = watch('social') || [];
  const [newSocialLink, setNewSocialLink] = useState({ platform: '', url: '', label: '' });

  const addSocialLink = () => {
    if (newSocialLink.platform && newSocialLink.url && newSocialLink.label) {
      setValue('social', [...social, { ...newSocialLink }]);
      setNewSocialLink({ platform: '', url: '', label: '' });
    }
  };

  const removeSocialLink = (index: number) => {
    setValue(
      'social',
      social.filter((_: any, i: number) => i !== index),
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          Social Links
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="platform">Platform</Label>
            <Input
              id="platform"
              value={newSocialLink.platform}
              onChange={e => setNewSocialLink(prev => ({ ...prev, platform: e.target.value }))}
              placeholder="facebook"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              value={newSocialLink.url}
              onChange={e => setNewSocialLink(prev => ({ ...prev, url: e.target.value }))}
              placeholder="https://facebook.com/yourpage"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              value={newSocialLink.label}
              onChange={e => setNewSocialLink(prev => ({ ...prev, label: e.target.value }))}
              placeholder="Follow us on Facebook"
            />
          </div>
        </div>
        <Button type="button" onClick={addSocialLink} variant="outline" className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Social Link
        </Button>
        <div className="space-y-2">
          {social.map((link: any, index: number) => (
            <div key={index} className="flex items-center justify-between rounded-md border p-3">
              <div className="flex items-center gap-3">
                <Badge variant="secondary">{link.platform}</Badge>
                <span className="text-sm">{link.label}</span>
                <span className="text-muted-foreground text-xs">{link.url}</span>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => removeSocialLink(index)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

'use client';

import { Plus, Trash2 } from 'lucide-react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
interface SubService {
  title: string;
  description: string;
}

interface SubServicesInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  description?: string;
  className?: string;
  disabled?: boolean;
}

export function SubServicesInput<T extends FieldValues>({
  control,
  name,
  label,
  description,
  className,
  disabled = false,
}: SubServicesInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const subServices = field.value || [];

        const addSubService = () => {
          const newSubService: SubService = {
            title: '',
            description: '',
          };
          field.onChange([...(subServices as SubService[]), newSubService]);
        };

        const removeSubService = (index: number) => {
          field.onChange((subServices as SubService[]).filter((_: SubService, i: number) => i !== index));
        };

        const updateSubService = (index: number, fieldName: keyof SubService, value: string) => {
          const updated = [...(subServices as SubService[])];
          updated[index] = { ...updated[index], [fieldName]: value };
          field.onChange(updated);
        };

        return (
          <FormItem className={className}>
            <FormControl>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Sub Services</CardTitle>
                      <p className="text-muted-foreground text-sm">Manage sub-services for this service.</p>
                    </div>
                    <Button
                      type="button"
                      onClick={addSubService}
                      variant="outline"
                      size="sm"
                      disabled={disabled}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Sub Service
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {subServices.map((subService: SubService, index: number) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Sub Service {index + 1}</CardTitle>
                          <Button
                            type="button"
                            onClick={() => removeSubService(index)}
                            variant="destructive"
                            size="sm"
                            disabled={disabled}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Title</label>
                          <Input
                            placeholder="Enter title"
                            value={subService.title || ''}
                            onChange={e => updateSubService(index, 'title', e.target.value)}
                            disabled={disabled}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Description</label>
                          <Textarea
                            placeholder="Enter description"
                            value={subService.description || ''}
                            onChange={e => updateSubService(index, 'description', e.target.value)}
                            className="min-h-[80px]"
                            disabled={disabled}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

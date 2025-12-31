'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { TextInput } from '@/components/shared/input/TextInput';
import { NumericInput } from '@/components/shared/input/NumericInput';
import { TextAreaInput } from '@/components/shared/input/TextAreaInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FacilityUnitItemGroup } from '@/types/facilities/facility.enums';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ItemsSection() {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const groupOptions = Object.values(FacilityUnitItemGroup).map(group => ({
    value: group,
    label: group.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()),
  }));

  const addItem = () => {
    append({
      title: '',
      group: undefined,
      qty: undefined,
      notes: undefined,
      order: undefined,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Items</CardTitle>
          <Button type="button" onClick={addItem} size="sm" variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.length === 0 ? (
          <p className="text-muted-foreground text-sm">No items added yet. Click "Add Item" to add one.</p>
        ) : (
          fields.map((field, index) => (
            <Card key={field.id} className="border-dashed">
              <CardContent className="pt-6">
                <div className="mb-4 flex items-start justify-between">
                  <h4 className="font-medium">Item {index + 1}</h4>
                  <Button type="button" onClick={() => remove(index)} variant="ghost" size="sm">
                    <Trash2 className="text-destructive h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <TextInput
                      control={control}
                      name={`items.${index}.title`}
                      label="Title"
                      placeholder="Enter item title"
                    />
                    <FormField
                      control={control}
                      name={`items.${index}.group`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Group</FormLabel>
                          <Select
                            onValueChange={val => field.onChange(val === '__none__' ? undefined : val)}
                            value={field.value || '__none__'}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select group (optional)" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="__none__">None</SelectItem>
                              {groupOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <NumericInput
                      control={control}
                      name={`items.${index}.qty`}
                      label="Quantity"
                      placeholder="Enter quantity"
                    />
                    <NumericInput
                      control={control}
                      name={`items.${index}.order`}
                      label="Order"
                      placeholder="Enter order"
                    />
                  </div>
                  <TextAreaInput
                    control={control}
                    name={`items.${index}.notes`}
                    label="Notes"
                    placeholder="Enter notes (optional)"
                    className="min-h-[60px]"
                  />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
}

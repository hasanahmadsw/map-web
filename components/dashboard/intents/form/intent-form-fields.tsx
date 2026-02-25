'use client';

import { useParams } from 'next/navigation';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EditorInput } from '@/components/shared/text-editor/EditorInput';
import { TextInput } from '@/components/shared/input/TextInput';
import { TextAreaInput } from '@/components/shared/input/TextAreaInput';
import { SelectInput } from '@/components/shared/input/SelectInput';
import { useIntentsForSelect, useIntentById } from '@/hooks/api/intents/use-intents';
import EquipmentFiltersSection from './equipment-filters-section';

const INTENT_TYPE_OPTIONS = [
  { value: 'HUB', label: 'HUB' },
  { value: 'CLUSTER', label: 'CLUSTER' },
  { value: 'CATEGORY', label: 'CATEGORY' },
  { value: 'BRAND', label: 'BRAND' },
  { value: 'MODEL', label: 'MODEL' },
  { value: 'OFFER', label: 'OFFER' },
  { value: 'LOCATION', label: 'LOCATION' },
];

function IntentFormFields({
  initialParentId,
  excludeId,
}: {
  initialParentId?: number | null;
  excludeId?: number;
} = {}) {
  const params = useParams();
  const intentId = params?.id as string | undefined;
  const { control } = useFormContext();

  const { intent: currentIntent } = useIntentById(intentId ?? '', !!intentId);
  const parentIdNum = initialParentId ?? currentIntent?.parentId ?? null;
  const resolvedExcludeId = excludeId ?? currentIntent?.id;

  const { intents, isLoading: intentsLoading } = useIntentsForSelect();
  const { intent: parentIntent, isLoading: parentIntentLoading } = useIntentById(
    parentIdNum ?? 0,
    !!parentIdNum,
  );

  const fromIntents = intents
    .filter(i => !resolvedExcludeId || i.id !== resolvedExcludeId)
    .map(i => ({ value: String(i.id), label: `${i.slug} (${i.type})` }));

  const hasParentInList = parentIdNum != null && fromIntents.some(o => o.value === String(parentIdNum));
  const parentOptions = [
    { value: '__none__', label: 'None' },
    ...(parentIntent && parentIdNum != null && !hasParentInList
      ? [{ value: String(parentIntent.id), label: `${parentIntent.slug} (${parentIntent.type})` }]
      : []),
    ...fromIntents,
  ];

  const hasParentOption = parentIdNum == null || parentOptions.some(o => o.value === String(parentIdNum));
  const parentSelectReady = !parentIdNum || hasParentOption;
  const parentSelectLoading = parentIdNum != null && !parentSelectReady && (intentsLoading || parentIntentLoading);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TextInput control={control} name="slug" label="Slug" placeholder="e.g. cameras" />

        <SelectInput
          control={control}
          name="type"
          label="Type"
          placeholder="Select type"
          options={INTENT_TYPE_OPTIONS}
        />

        <FormField
          control={control}
          name="parentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent</FormLabel>
              {parentSelectLoading ? (
                <FormControl>
                  <Input disabled value="" placeholder="Loading parent..." readOnly />
                </FormControl>
              ) : (
                <Select
                  onValueChange={field.onChange}
                  value={
                    field.value != null && field.value !== '' && field.value !== '__none__'
                      ? String(field.value)
                      : '__none__'
                  }
                  disabled={intentsLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={intentsLoading ? 'Loading...' : 'Select parent'} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {parentOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <TextInput control={control} name="h1" label="H1" placeholder="Page title" />

        <TextInput control={control} name="linkLabel" label="Link Label" placeholder="Label for links" />
      </div>

      <TextInput control={control} name="metaTitle" label="Meta Title" placeholder="SEO title" />
      <TextAreaInput
        control={control}
        name="metaDescription"
        label="Meta Description"
        placeholder="SEO description"
      />
      <TextInput control={control} name="metaKeywords" label="Meta Keywords" placeholder="keyword1, keyword2" />
      <TextInput control={control} name="subHeading" label="Sub Heading" placeholder="Subtitle" />
      <EditorInput
        control={control}
        name="content"
        label="Content"
        placeholder="Page content (HTML supported)"
      />

      <EquipmentFiltersSection />
    </>
  );
}

export default IntentFormFields;

import ArrayInput from '@/components/shared/input/ArrayInput';

export function TagsTopicsSection() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <ArrayInput name="tags" label="Tags" placeholder="Enter tag name" />
      <ArrayInput name="topics" label="Topics" placeholder="Enter topic name" />
    </div>
  );
}

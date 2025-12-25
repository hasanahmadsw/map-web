import { extractPathname } from '@/utils/filters/format-utils';
import { generateEquipmentPageTitleAndDescription } from '@/utils/seo/meta/equipment-meta/build-equipment-meta';

type SearchResultsHeadingProps = {
  filters: string[];
  categories: string[];
};

async function SearchResultsHeading({ filters, categories }: SearchResultsHeadingProps) {
  // =============== Extract pathname
  const { type, category, brand } = extractPathname(filters, categories);

  // =============== Generate title
  const { title, description } = generateEquipmentPageTitleAndDescription({
    type,
    category,
    brand,
  });

  return (
    <div className="space-y-2">
      <h1 className="text-2xl leading-tight font-bold">{title}</h1>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}

export default SearchResultsHeading;

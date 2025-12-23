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
  const { title } = generateEquipmentPageTitleAndDescription({
    type,
    category,
    brand,
  });

  return (
    <div className="mt-4 mb-2 flex items-center justify-between">
      <h1 className="text-xl leading-tight font-semibold">{title}</h1>
    </div>
  );
}

export default SearchResultsHeading;

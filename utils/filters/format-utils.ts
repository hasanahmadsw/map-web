import { capitalizeEachWord } from '../format';

export function formatText(text: string) {
  return text
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// ============================== Generate breadcrumb label
export function generateBreadcrumbLabel(dict: Record<string, string>, label: string) {
  if (label.includes('-')) {
    const newLabel = label
      .split('-')
      .map(word => dict?.[word] || word)
      .join(' ');
    return newLabel;
  }

  return dict?.[label] || label;
}

import sanitizeHtml from 'sanitize-html';

const allowedTags = [
  'p',
  'div',
  'span',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'ul',
  'ol',
  'li',
  'blockquote',
  'pre',
  'code',
  'strong',
  'em',
  'a',
  'img',
  'br',
  'hr',
  'table',
  'thead',
  'tbody',
  'tr',
  'td',
  'th',
];

const allowedAttributes = {
  a: ['href', 'name', 'target', 'rel'],
  img: ['src', 'alt', 'title', 'width', 'height'],
  span: ['dir', 'style', 'class'],
  '*': ['class'],
};

const tagClasses: Record<string, string> = {
  h1: 'scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0 mt-8 mb-4',
  h2: 'scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0 mt-8 mb-4',
  h3: 'scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0 mt-8 mb-4',
  h4: 'scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0 mt-8 mb-4',
  h5: 'scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0 mt-8 mb-4',
  h6: 'scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0 mt-8 mb-4',
  p: 'leading-7 [&:not(:first-child)]:mt-6',
  ul: 'my-6 ml-6 list-disc [&>li]:mt-2',
  ol: 'my-6 ml-6 list-decimal [&>li]:mt-2',
  blockquote: 'mt-6 border-l-2 pl-6 italic',
  pre: 'mb-4 mt-6 overflow-x-auto rounded-lg border bg-black py-4',
  code: 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
  a: 'font-medium underline underline-offset-4 hover:text-primary',
  img: 'rounded-lg border',
  table: 'w-full overflow-y-auto',
  thead: '[&_tr]:border-b',
  tbody: '[&_tr:last-child]:border-0',
  tr: 'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
  th: 'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
  td: 'p-4 align-middle [&:has([role=checkbox])]:pr-0',
};

/**
 * Wraps phone numbers in spans with dir="ltr" to ensure correct display in RTL contexts
 * Phone number patterns: + followed by digits and spaces, or digits with spaces/dashes
 * Examples: +971 50 494 7393, +1 234 567 8900, 050-123-4567
 */
function wrapPhoneNumbersWithLtr(html: string): string {
  // Pattern to match phone numbers in text content
  // Matches international format: + followed by digits and spaces/dashes
  // Or local format: digits with spaces, dashes, or parentheses
  const phonePattern = /(\+?\d{1,4}[\s\-]?\(?\d{1,4}\)?[\s\-]?)?(\d{1,4}[\s\-]?){2,}\d{1,9}/g;

  // Process HTML by replacing phone numbers only in text content (not in tags)
  // We'll use a simple approach: replace in text nodes only
  let result = html;
  const matches: Array<{ start: number; end: number; match: string }> = [];

  // Find all phone number matches
  let match;
  while ((match = phonePattern.exec(html)) !== null) {
    const start = match.index;
    const end = start + match[0].length;

    // Check if this match is inside an HTML tag
    const beforeMatch = html.substring(Math.max(0, start - 100), start);
    const lastOpenTag = beforeMatch.lastIndexOf('<');
    const lastCloseTag = beforeMatch.lastIndexOf('>');

    // If we're inside a tag (between < and >), skip this match
    if (lastOpenTag > lastCloseTag) {
      continue;
    }

    // Check if already wrapped in a span with dir
    const context = html.substring(Math.max(0, start - 20), Math.min(html.length, end + 20));
    if (context.includes('dir="ltr"') || context.includes("dir='ltr'")) {
      continue;
    }

    // Validate it's a phone number (7-15 digits)
    const digitCount = (match[0].match(/\d/g) || []).length;
    if (digitCount >= 7 && digitCount <= 15) {
      matches.push({ start, end, match: match[0] });
    }
  }

  // Replace matches from end to start to preserve indices
  for (let i = matches.length - 1; i >= 0; i--) {
    const { start, end, match: phoneNumber } = matches[i];
    const wrapped = `<span dir="ltr" style="unicode-bidi: embed; display: inline-block;">${phoneNumber}</span>`;
    result = result.substring(0, start) + wrapped + result.substring(end);
  }

  return result;
}

export function sanitizeHtmlContent(content: string): string {
  const sanitized = sanitizeHtml(content, {
    allowedTags,
    allowedAttributes,
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    transformTags: Object.fromEntries(
      Object.entries(tagClasses).map(([tag, cls]) => [
        tag,
        (tagName: string, attribs: Record<string, string>) => ({
          tagName,
          attribs: {
            ...attribs,
            class: cls + (attribs.class ? ` ${attribs.class}` : ''),
          },
        }),
      ]),
    ),
  });

  // Wrap phone numbers with LTR direction
  return wrapPhoneNumbersWithLtr(sanitized);
}

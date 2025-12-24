import { cn } from "@/lib/utils";
import { sanitizeHtmlContent } from "@/utils/sanitize-html";

interface SafeHtmlContentProps {
   content: string;
   className?: string;
   hasProse?: boolean;
}

function SafeHtmlContent({
   content,
   className = "",
   hasProse = true,
}: SafeHtmlContentProps) {
   if (!content) return <p>No Content Available</p>;

   const sanitized = sanitizeHtmlContent(content);

   if (!hasProse) {
      return (
         <div
            className={className}
            dangerouslySetInnerHTML={{ __html: sanitized }}
         ></div>
      );
   }

   return (
      <div
         className={cn(
            "prose prose-lg dark:prose-invert max-w-none",
            "prose-headings:scroll-m-20 prose-headings:text-2xl prose-headings:font-semibold prose-headings:tracking-tight prose-headings:first:mt-0 prose-headings:mt-8 prose-headings:mb-4",
            "prose-p:leading-7 prose-p:not-first:mt-6",
            "prose-ul:my-6 prose-ul:ml-6 prose-ul:list-disc prose-ul:[&>li]:mt-2",
            "prose-ol:my-6 prose-ol:ml-6 prose-ol:list-decimal prose-ol:[&>li]:mt-2",
            "prose-blockquote:mt-6 prose-blockquote:border-l-2 prose-blockquote:pl-6 prose-blockquote:italic",
            "prose-pre:mb-4 prose-pre:mt-6 prose-pre:overflow-x-auto prose-pre:rounded-lg prose-pre:border prose-pre:bg-black prose-pre:py-4",
            "prose-code:relative prose-code:rounded prose-code:bg-muted prose-code:px-[0.3rem] prose-code:py-[0.2rem] prose-code:font-mono prose-code:text-sm prose-code:font-semibold",
            "prose-a:font-medium prose-a:underline prose-a:underline-offset-4 prose-a:hover:text-primary",
            "prose-img:rounded-lg prose-img:border prose-img:loading-lazy",
            "prose-table:w-full prose-table:overflow-y-auto",
            "prose-thead:[&_tr]:border-b",
            "prose-tbody:[&_tr:last-child]:border-0",
            "prose-tr:border-b prose-tr:transition-colors prose-tr:hover:bg-muted/50 prose-tr:data-[state=selected]:bg-muted",
            "prose-th:h-12 prose-th:px-4 prose-th:text-left prose-th:align-middle prose-th:font-medium prose-th:text-muted-foreground prose-th:[&:has([role=checkbox])]:pr-0",
            "prose-td:p-4 prose-td:align-middle prose-td:[&:has([role=checkbox])]:pr-0",
            className
         )}
         dangerouslySetInnerHTML={{ __html: sanitized }}
      />
   );
}

export default SafeHtmlContent;

"use client";
import React from "react";
import DivHtml from "./div-html";

interface HtmlViewerProps {
  content: string;
  label?: string;
  className?: string;
  minHeight?: string;
}

function HtmlViewer({
  content,
  label,
  className = "",
  minHeight = "min-h-[150px]",
}: HtmlViewerProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
      <div
        className={`
        border rounded-md p-4 
        bg-muted/50 
        text-sm 
        ${minHeight}
        overflow-auto
        prose prose-sm max-w-none
        prose-headings:mt-2 prose-headings:mb-1
        prose-p:my-1
        prose-ul:my-1 prose-ol:my-1
        prose-li:my-0
        prose-img:my-2
        prose-table:my-2
        prose-blockquote:my-2
      `}
      >
        {content ? (
        <DivHtml html={content} />
        ) : (
          <p className="text-muted-foreground italic">No content available</p>
        )}
      </div>
    </div>
  );
}

export default HtmlViewer;

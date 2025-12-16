import type { Editor } from "@tiptap/react";
import { BotIcon, Code2, Heading1, Heading2, Heading3, List, ListOrdered, Minus, Quote, Type } from "lucide-react";

export interface SlashCommand {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  keywords: string[];
  execute: (editor: Editor) => void;
}

export const slashCommands: SlashCommand[] = [
  {
    id: "heading1",
    label: "Heading 1",
    description: "Large section heading",
    icon: <Heading1 className="h-4 w-4" />,
    keywords: ["h1", "heading1", "title"],
    execute: (editor) => editor.chain().focus().setHeading({ level: 1 }).run(),
  },
  {
    id: "heading2",
    label: "Heading 2",
    description: "Medium section heading",
    icon: <Heading2 className="h-4 w-4" />,
    keywords: ["h2", "heading2", "subtitle"],
    execute: (editor) => editor.chain().focus().setHeading({ level: 2 }).run(),
  },
  {
    id: "heading3",
    label: "Heading 3",
    description: "Small section heading",
    icon: <Heading3 className="h-4 w-4" />,
    keywords: ["h3", "heading3"],
    execute: (editor) => editor.chain().focus().setHeading({ level: 3 }).run(),
  },
  {
    id: "paragraph",
    label: "Paragraph",
    description: "Regular text paragraph",
    icon: <Type className="h-4 w-4" />,
    keywords: ["p", "paragraph", "text"],
    execute: (editor) => editor.chain().focus().setParagraph().run(),
  },
  {
    id: "bulletList",
    label: "Bullet List",
    description: "Create a bullet list",
    icon: <List className="h-4 w-4" />,
    keywords: ["ul", "bullet", "list", "unordered"],
    execute: (editor) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    id: "orderedList",
    label: "Numbered List",
    description: "Create a numbered list",
    icon: <ListOrdered className="h-4 w-4" />,
    keywords: ["ol", "numbered", "ordered", "list"],
    execute: (editor) => editor.chain().focus().toggleOrderedList().run(),
  },
  {
    id: "blockquote",
    label: "Quote",
    description: "Create a blockquote",
    icon: <Quote className="h-4 w-4" />,
    keywords: ["quote", "blockquote", "citation"],
    execute: (editor) => editor.chain().focus().toggleBlockquote().run(),
  },
  {
    id: "codeBlock",
    label: "Code Block",
    description: "Create a code block",
    icon: <Code2 className="h-4 w-4" />,
    keywords: ["code", "pre", "codeblock"],
    execute: (editor) => editor.chain().focus().toggleCodeBlock().run(),
  },
  {
    id: "horizontalRule",
    label: "Divider",
    description: "Add a horizontal rule",
    icon: <Minus className="h-4 w-4" />,
    keywords: ["hr", "divider", "line", "rule"],
    execute: (editor) => editor.chain().focus().setHorizontalRule().run(),
  },
];

export interface SlashCommandState {
  show: boolean;
  query: string;
  position: { from: number; to: number } | null;
  coords: { x: number; y: number } | null;
}

export interface SlashCommandHandlers {
  onExecute: (command: SlashCommand) => void;
  onClose: () => void;
  onQueryChange: (query: string) => void;
}

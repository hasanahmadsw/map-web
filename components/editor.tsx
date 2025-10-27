"use client";

import Highlight from "@tiptap/extension-highlight";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Check,
  ChevronDown,
  Code,
  Code2,
  CornerDownLeft,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Square,
  Strikethrough,
  Type,
  Undo2,
  Unlink,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AiMenu } from "@/components/ai/ai-menu";
import { SlashCommandMenu } from "@/components/editor/slash-command-menu";
import { useSlashCommand } from "@/components/editor/use-slash-command";

export default function ArticleEditor({
  initialHTML = "",
  onChange,
}: {
  initialHTML?: string;
  onChange?: (html: string) => void;
}) {
  const [isHeadingMenuOpen, setIsHeadingMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // AI streaming controls state
  const [aiStreamingState, setAiStreamingState] = useState<{
    isStreaming: boolean;
    controlsVisible: boolean;
    streamPosition?: { from: number; to: number };
    onStop?: () => void;
    onAccept?: () => void;
    onReject?: () => void;
  }>({
    isStreaming: false,
    controlsVisible: false,
  });

  // State for control positioning
  const [controlPosition, setControlPosition] = useState<{ top: number; left: number } | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Write Something... Press / to Get Started" }),
      LinkExtension.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
      Highlight,
    ],
    immediatelyRender: false,
    // shouldRerenderOnTransaction: true,
    autofocus: true,
    editable: true,
    content: initialHTML,
    editorProps: {
      attributes: {
        dir: "auto",
        class: "prose max-w-none min-h-[220px] p-3 outline-none",
      },
    },
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
  });

  // Slash command functionality
  const slashCommand = useSlashCommand(editor);

  // Handle keyboard events for slash commands
  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (
      view: {
        state: { selection: { from: number }; doc: { textBetween: (from: number, to: number) => string } };
        coordsAtPos: (pos: number) => { left: number; bottom: number };
      },
      event: KeyboardEvent,
    ) => {
      // Handle slash command detection
      if (event.key === "/") {
        const { from } = view.state.selection;
        const textBefore = view.state.doc.textBetween(Math.max(0, from - 50), from);

        // Check if we're at the start of a line or after whitespace (including spaces, tabs, newlines)
        const isAtLineStart =
          textBefore === "" || textBefore.endsWith("\n") || textBefore.endsWith(" ") || textBefore.endsWith("\t");

        // Also check if we're at the beginning of a word (after whitespace or punctuation)
        const isAtWordStart = textBefore === "" || /[\s\n\t.,!?;:]$/.test(textBefore);

        if (isAtLineStart || isAtWordStart) {
          // Get cursor coordinates for positioning
          const coords = view.coordsAtPos(from);
          slashCommand.openSlashCommand(from, { x: coords.left, y: coords.bottom });
          return true; // Prevent default behavior
        }
      }

      // Handle escape to close slash command
      if (event.key === "Escape" && slashCommand.state.show) {
        slashCommand.handlers.onClose();
        return true;
      }

      // Handle backspace to close slash command if query is empty
      if (event.key === "Backspace" && slashCommand.state.show && slashCommand.state.query === "") {
        slashCommand.handlers.onClose();
        return true;
      }

      // Handle Enter to execute first command when slash menu is open
      if (event.key === "Enter" && slashCommand.state.show && slashCommand.filteredCommands.length > 0) {
        event.preventDefault();
        slashCommand.handlers.onExecute(slashCommand.filteredCommands[0]);
        return true;
      }

      return false;
    };

    // Update editor props to include keyboard handling
    editor.setOptions({
      editorProps: {
        ...editor.options.editorProps,
        handleKeyDown,
      },
    });

    // Update slash command query when editor content changes
    const handleUpdate = () => {
      slashCommand.updateQueryFromEditor();
    };

    editor.on("update", handleUpdate);

    return () => {
      editor.off("update", handleUpdate);
    };
  }, [editor, slashCommand]);

  const getCurrentHeading = () => {
    if (!editor) return "Paragraph";
    if (editor.isActive("heading", { level: 1 })) return "H1";
    if (editor.isActive("heading", { level: 2 })) return "H2";
    if (editor.isActive("heading", { level: 3 })) return "H3";
    return "Paragraph";
  };

  // Reusable Editor Button Component
  const EditorButton = ({
    active,
    onClick,
    title,
    children,
    size = "default",
  }: {
    active: boolean;
    onClick: () => void;
    title: string;
    children: React.ReactNode;
    size?: "default" | "sm" | "lg";
  }) => {
    const baseClasses = "cursor-pointer rounded-md border text-sm transition-colors hover:bg-muted/50";
    const sizeClasses = size === "sm" ? "px-2 py-2" : size === "lg" ? "px-2 py-2" : "px-2 py-2";
    const activeClasses = active ? "bg-muted" : "border-border hover:border-muted";

    return (
      <button
        type="button"
        className={`${baseClasses} ${sizeClasses} ${activeClasses}`}
        onClick={onClick}
        title={title}
      >
        {children}
      </button>
    );
  };

  // Calculate control position when streaming state changes
  useEffect(() => {
    if (aiStreamingState.streamPosition && editor) {
      const updatePosition = () => {
        try {
          if (!aiStreamingState.streamPosition) return;

          const editorRect = editor.view.dom.getBoundingClientRect();
          const coords = editor.view.coordsAtPos(aiStreamingState.streamPosition.to);

          setControlPosition({
            top: coords.bottom - editorRect.top + 8,
            left: coords.left - editorRect.left,
          });
        } catch (error) {
          console.warn("Error calculating control position:", error);
        }
      };

      // Update position immediately
      updatePosition();

      // Update position on scroll and resize
      const handleUpdate = () => {
        if (aiStreamingState.isStreaming || aiStreamingState.controlsVisible) {
          updatePosition();
        }
      };

      window.addEventListener("scroll", handleUpdate, true);
      window.addEventListener("resize", handleUpdate);

      return () => {
        window.removeEventListener("scroll", handleUpdate, true);
        window.removeEventListener("resize", handleUpdate);
      };
    } else {
      setControlPosition(null);
    }
  }, [aiStreamingState.streamPosition, aiStreamingState.isStreaming, aiStreamingState.controlsVisible, editor]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsHeadingMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!editor) return null;

  return (
    <div className="space-y-2">
      {/* StarterKit essentials toolbar */}
      <div className="flex flex-wrap gap-2">
        {/* Heading Dropdown Menu */}
        <div className="relative" ref={dropdownRef}>
          <EditorButton
            active={editor.isActive("heading") || editor.isActive("paragraph")}
            onClick={() => setIsHeadingMenuOpen(!isHeadingMenuOpen)}
            title="Text Format"
          >
            <div className="flex items-center gap-1">
              {getCurrentHeading()}
              <ChevronDown className="h-3 w-3" />
            </div>
          </EditorButton>

          {isHeadingMenuOpen && (
            <div className="absolute top-full left-0 mt-1 bg-card border rounded-lg shadow-lg z-10 min-w-[120px]">
              <div className="p-1 space-y-1 flex flex-col  ">
                <EditorButton
                  active={editor.isActive("paragraph")}
                  onClick={() => {
                    editor.chain().focus().setParagraph().run();
                    setIsHeadingMenuOpen(false);
                  }}
                  title="Paragraph"
                >
                  <div className="flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    Paragraph
                  </div>
                </EditorButton>
                <EditorButton
                  active={editor.isActive("heading", { level: 1 })}
                  onClick={() => {
                    editor.chain().focus().setHeading({ level: 1 }).run();
                    setIsHeadingMenuOpen(false);
                  }}
                  title="Heading 1"
                >
                  <div className="flex items-center gap-2">
                    <Heading1 className="h-4 w-4" />
                    Heading 1
                  </div>
                </EditorButton>
                <EditorButton
                  active={editor.isActive("heading", { level: 2 })}
                  onClick={() => {
                    editor.chain().focus().setHeading({ level: 2 }).run();
                    setIsHeadingMenuOpen(false);
                  }}
                  title="Heading 2"
                >
                  <div className="flex items-center gap-2">
                    <Heading2 className="h-4 w-4" />
                    Heading 2
                  </div>
                </EditorButton>
                <EditorButton
                  active={editor.isActive("heading", { level: 3 })}
                  onClick={() => {
                    editor.chain().focus().setHeading({ level: 3 }).run();
                    setIsHeadingMenuOpen(false);
                  }}
                  title="Heading 3"
                >
                  <div className="flex items-center gap-2">
                    <Heading3 className="h-4 w-4" />
                    Heading 3
                  </div>
                </EditorButton>
              </div>
            </div>
          )}
        </div>

        {/* Marks */}
        <EditorButton
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </EditorButton>
        <EditorButton
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </EditorButton>
        <EditorButton
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </EditorButton>
        <EditorButton
          active={editor.isActive("code")}
          onClick={() => editor.chain().focus().toggleCode().run()}
          title="Inline code"
        >
          <Code className="h-4 w-4" />
        </EditorButton>

        {/* Blocks */}
        <EditorButton
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </EditorButton>
        <EditorButton
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet list"
        >
          <List className="h-4 w-4" />
        </EditorButton>
        <EditorButton
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Ordered list"
        >
          <ListOrdered className="h-4 w-4" />
        </EditorButton>
        <EditorButton
          active={editor.isActive("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          title="Code block"
        >
          <Code2 className="h-4 w-4" />
        </EditorButton>

        {/* Rules & breaks */}
        <EditorButton
          active={false}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal rule"
        >
          <Minus className="h-4 w-4" />
        </EditorButton>
        <EditorButton active={false} onClick={() => editor.chain().focus().setHardBreak().run()} title="Hard break">
          <CornerDownLeft className="h-4 w-4" />
        </EditorButton>

        {/* History */}
        <EditorButton active={false} onClick={() => editor.chain().focus().undo().run()} title="Undo">
          <Undo2 className="h-4 w-4" />
        </EditorButton>
        <EditorButton active={false} onClick={() => editor.chain().focus().redo().run()} title="Redo">
          <Redo2 className="h-4 w-4" />
        </EditorButton>

        <EditorButton
          active={editor.isActive("link")}
          onClick={() => {
            const url = prompt("ضع الرابط هنا:");
            if (url) {
              editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
            }
          }}
          title="Add link"
        >
          <Link className="h-4 w-4" />
        </EditorButton>

        <EditorButton active={false} onClick={() => editor.chain().focus().unsetLink().run()} title="Remove link">
          <Unlink className="h-4 w-4" />
        </EditorButton>

        {/* AI Components */}
        <AiMenu editor={editor} onStreamingStateChange={setAiStreamingState} />
      </div>
      {/* Floating bubble menu (appears on text selection) */}
      <BubbleMenu editor={editor}>
        <div className="flex items-center gap-1 bg-card border border-muted shadow-md rounded-md p-1 animate-in fade-in-0 zoom-in-95 duration-150">
          <EditorButton
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Bold"
            size="sm"
          >
            <Bold className="h-4 w-4" />
          </EditorButton>
          <EditorButton
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italic"
            size="sm"
          >
            <Italic className="h-4 w-4" />
          </EditorButton>
          <EditorButton
            active={editor.isActive("strike")}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            title="Strikethrough"
            size="sm"
          >
            <Strikethrough className="h-4 w-4" />
          </EditorButton>
          <EditorButton
            active={editor.isActive("code")}
            onClick={() => editor.chain().focus().toggleCode().run()}
            title="Inline code"
            size="sm"
          >
            <Code className="h-4 w-4" />
          </EditorButton>
          <EditorButton
            active={editor.isActive("blockquote")}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            title="Blockquote"
            size="sm"
          >
            <Quote className="h-4 w-4" />
          </EditorButton>

          {/* AI Components in Bubble Menu */}
          <div className="border-l border-muted mx-1" />
          <AiMenu editor={editor} onStreamingStateChange={setAiStreamingState} />
        </div>
      </BubbleMenu>

      <div className="border rounded-lg relative overflow-visible">
        <EditorContent editor={editor} />

        {/* AI Streaming Controls - Positioned under the streaming text */}
        {(aiStreamingState.isStreaming || aiStreamingState.controlsVisible) && controlPosition && (
          <div
            className="absolute z-50 flex items-center gap-2 rounded-xl border bg-card backdrop-blur px-4 py-3 shadow"
            style={{
              top: controlPosition.top,
              left: controlPosition.left,
            }}
          >
            {aiStreamingState.isStreaming ? (
              <button
                type="button"
                onClick={aiStreamingState.onStop}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-xl border hover:bg-muted text-sm cursor-pointer"
                title="Stop"
              >
                <Square className="h-3.5 w-3.5" /> Stop
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={aiStreamingState.onAccept}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white text-sm cursor-pointer"
                  title="Accept"
                >
                  <Check className="h-3.5 w-3.5" /> Accept
                </button>
                <button
                  type="button"
                  onClick={aiStreamingState.onReject}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-sm cursor-pointer"
                  title="Reject"
                >
                  <X className="h-3.5 w-3.5" /> Discard
                </button>
              </>
            )}
          </div>
        )}

        {/* Slash Command Menu */}
        <SlashCommandMenu editor={editor} state={slashCommand.state} handlers={slashCommand.handlers} />
      </div>
    </div>
  );
}

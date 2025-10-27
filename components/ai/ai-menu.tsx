"use client";

import { useChat } from "@ai-sdk/react";
import type { Editor } from "@tiptap/react";
import { DefaultChatTransport } from "ai";
import {
  ArrowRight,
  CheckCircle,
  Expand,
  FileText,
  Loader2,
  Minimize,
  Palette,
  Sparkles,
  Wand2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAi } from "@/providers/ai-provider";

interface AiStreamingState {
  isStreaming: boolean;
  controlsVisible: boolean;
  streamPosition?: { from: number; to: number };
  onStop?: () => void;
  onAccept?: () => void;
  onReject?: () => void;
}

interface AiMenuProps {
  className?: string;
  editor: Editor;
  onStreamingStateChange?: (state: AiStreamingState) => void;
}

interface AiAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  category: "edit" | "write" | "style";
}

const AI_ACTIONS: AiAction[] = [
  {
    id: "improve",
    label: "Improve Writing",
    icon: <Wand2 className="h-4 w-4" />,
    description: "Enhance clarity and flow",
    category: "edit",
  },
  {
    id: "fix-grammar",
    label: "Fix Grammar",
    icon: <CheckCircle className="h-4 w-4" />,
    description: "Correct spelling and grammar",
    category: "edit",
  },
  {
    id: "expand",
    label: "Expand",
    icon: <Expand className="h-4 w-4" />,
    description: "Add more details",
    category: "write",
  },
  {
    id: "shorten",
    label: "Shorten",
    icon: <Minimize className="h-4 w-4" />,
    description: "Make more concise",
    category: "write",
  },
  {
    id: "summarize",
    label: "Summarize",
    icon: <FileText className="h-4 w-4" />,
    description: "Create a summary",
    category: "write",
  },
  {
    id: "continue",
    label: "Continue Writing",
    icon: <ArrowRight className="h-4 w-4" />,
    description: "Continue the text",
    category: "write",
  },
  {
    id: "tone",
    label: "Adjust Tone",
    icon: <Palette className="h-4 w-4" />,
    description: "Change writing tone",
    category: "style",
  },
];

const TONE_OPTIONS = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "friendly", label: "Friendly" },
  { value: "formal", label: "Formal" },
  { value: "creative", label: "Creative" },
];

const HIGHLIGHT_COLOR = "#fef3c7";
const NO_SELECTION_TIMEOUT = 3000;

export function AiMenu({ className, editor, onStreamingStateChange }: AiMenuProps) {
  const { isAiAvailable, isProcessing, setIsProcessing } = useAi();
  const [isOpen, setIsOpen] = useState(false);
  const [tone, setTone] = useState("professional");
  const [customMessage, setCustomMessage] = useState("");
  const [showNoSelectionMessage, setShowNoSelectionMessage] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Streaming state
  const [range, setRange] = useState<{ from: number; to: number } | null>(null);
  const [original, setOriginal] = useState("");
  const [streamText, setStreamText] = useState("");
  const [lastRenderedLen, setLastRenderedLen] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(false);

  const { sendMessage, stop, status, messages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onFinish: () => {
      setIsProcessing(false);
      setControlsVisible(true);
    },
    onError: () => {
      setIsProcessing(false);
    },
  });

  // Extract text from streaming messages
  useEffect(() => {
    if (status !== "streaming" || !range || messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== "assistant") return;

    const parts = (lastMessage as { parts?: Array<{ type: string; text: string }> }).parts || [];
    const text = parts
      .filter((p) => p.type === "text")
      .map((p) => p.text)
      .join("");

    if (typeof text === "string") {
      setStreamText(text);
    }
  }, [messages, status, range]);

  // Update editor with streaming text
  useEffect(() => {
    if (!range || !editor) return;

    const { from } = range;
    const currentLen = streamText.length;

    editor
      .chain()
      .focus()
      .insertContentAt({ from, to: from + lastRenderedLen }, streamText, { updateSelection: false })
      .setHighlight({ color: HIGHLIGHT_COLOR })
      .run();

    setLastRenderedLen(currentLen);
  }, [streamText, range, editor, lastRenderedLen]);

  // Validate selection and show warning if needed
  const validateSelection = useCallback(() => {
    if (!editor) return null;

    const { from, to } = editor.state.selection;
    const selected = editor.state.doc.textBetween(from, to).trim();

    if (!selected) {
      setShowNoSelectionMessage(true);
      setTimeout(() => setShowNoSelectionMessage(false), NO_SELECTION_TIMEOUT);
      return null;
    }

    return { selected, from, to };
  }, [editor]);

  // Start AI request with prompt
  const startAiRequest = useCallback(
    async (promptText: string) => {
      const selection = validateSelection();
      if (!selection) return;

      const { selected, from, to } = selection;

      // Store state for streaming
      setOriginal(selected);
      setRange({ from, to });
      setStreamText("");
      setLastRenderedLen(0);
      setControlsVisible(false);

      // Clear selection and prepare for streaming
      editor.chain().focus().deleteRange({ from, to }).insertContentAt(from, "").run();

      setIsProcessing(true);

      const prompt = `Please transform the following selection based on the instruction.\n\nInstruction:\n${promptText}\n\nSelection:\n${selected}`;
      await sendMessage({ text: prompt });
    },
    [editor, sendMessage, validateSelection, setIsProcessing],
  );

  // Handle custom message
  const handleCustomMessage = useCallback(async () => {
    if (!customMessage.trim()) return;
    await startAiRequest(customMessage);
  }, [customMessage, startAiRequest]);

  // Handle predefined actions
  const handleAction = useCallback(
    async (actionId: string) => {
      const contextInfo = actionId === "tone" ? ` with ${tone} tone` : "";
      const actionText = `Action: ${actionId}${contextInfo}`;
      await startAiRequest(actionText);
    },
    [startAiRequest, tone],
  );

  // Cleanup streaming state
  const cleanup = useCallback(() => {
    setRange(null);
    setOriginal("");
    setStreamText("");
    setLastRenderedLen(0);
    setControlsVisible(false);
  }, []);

  // Accept AI changes
  const handleAccept = useCallback(() => {
    if (range && editor) {
      editor.chain().focus().unsetHighlight().run();
    }
    cleanup();
  }, [cleanup, range, editor]);

  // Reject AI changes and restore original
  const handleReject = useCallback(() => {
    if (range) {
      const { from } = range;
      editor
        .chain()
        .focus()
        .insertContentAt({ from, to: from + lastRenderedLen }, original, { updateSelection: false })
        .run();
    }
    cleanup();
  }, [range, editor, lastRenderedLen, original, cleanup]);

  // Stop streaming
  const handleStop = useCallback(() => {
    stop();
    setIsProcessing(false);
    setControlsVisible(true);
  }, [stop, setIsProcessing]);

  // Communicate streaming state changes
  useEffect(() => {
    if (!onStreamingStateChange) return;

    const currentStreamPosition = range ? { from: range.from, to: range.from + lastRenderedLen } : undefined;

    onStreamingStateChange({
      isStreaming: status === "streaming",
      controlsVisible,
      streamPosition: currentStreamPosition,
      onStop: handleStop,
      onAccept: handleAccept,
      onReject: handleReject,
    });
  }, [status, controlsVisible, range, lastRenderedLen, onStreamingStateChange, handleStop, handleAccept, handleReject]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
      setCustomMessage("");
      setShowNoSelectionMessage(false);
    };
  }, [cleanup]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Don't render if AI is not available
  if (!isAiAvailable) {
    return null;
  }

  const groupedActions = AI_ACTIONS.reduce(
    (acc, action) => {
      if (!acc[action.category]) {
        acc[action.category] = [];
      }
      acc[action.category].push(action);
      return acc;
    },
    {} as Record<string, AiAction[]>,
  );

  const isDisabled = isProcessing || status !== "ready";

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isDisabled}
        className="cursor-pointer px-3 py-2 rounded-md border text-sm transition-colors bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white flex items-center gap-2"
        title="AI Writing Assistant"
      >
        {isDisabled ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        Ask AI
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-120 bg-card border rounded-lg shadow-lg z-50 p-4">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-2 pb-2 border-b">
              <Sparkles className="h-4 w-4" />
              <h3 className="font-medium">AI Assistant</h3>
            </div>

            {showNoSelectionMessage ? (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex items-center gap-2">
                  <X className="h-4 w-4 text-yellow-600" />
                  <h4 className="text-sm font-medium text-yellow-800">No Text Selected</h4>
                </div>
                <p className="text-xs text-yellow-600 mt-1">
                  Please select some text in the editor before using AI tools.
                </p>
              </div>
            ) : (
              <>
                {/* Custom Message Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="What would you like AI to do?"
                    className="flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleCustomMessage();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleCustomMessage}
                    disabled={!customMessage.trim() || isDisabled}
                    className="px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isDisabled ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  </button>
                </div>

                <div className="border-t" />

                {/* Action Groups */}
                {Object.entries(groupedActions).map(([category, actions]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{category}</h4>
                    <div className="grid grid-cols-1 gap-1">
                      {actions.map((action) => (
                        <button
                          type="button"
                          key={action.id}
                          onClick={() => handleAction(action.id)}
                          disabled={isDisabled}
                          className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 text-left disabled:opacity-50 cursor-pointer"
                        >
                          {action.icon}
                          <div className="flex-1">
                            <div className="text-sm font-medium">{action.label}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Tone Selection */}
                <div className="pt-2 border-t">
                  <label htmlFor="tone-select" className="text-xs font-medium text-muted-foreground">
                    Tone
                  </label>
                  <select
                    id="tone-select"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full mt-1 p-1 border rounded text-sm"
                  >
                    {TONE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

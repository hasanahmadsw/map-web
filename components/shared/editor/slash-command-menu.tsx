"use client";

import type { Editor } from "@tiptap/react";
import { useEffect, useRef } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { type SlashCommand, type SlashCommandHandlers, type SlashCommandState, slashCommands } from "./slash-commands";

interface SlashCommandMenuProps {
  editor: Editor;
  state: SlashCommandState;
  handlers: SlashCommandHandlers;
}

export function SlashCommandMenu({ editor, state, handlers }: SlashCommandMenuProps) {
  const { show, query, coords } = state;
  const { onExecute, onClose, onQueryChange } = handlers;
  const menuRef = useRef<HTMLDivElement>(null);

  // Filter commands based on query
  const filteredCommands = slashCommands.filter((command) => {
    if (!query) return true;
    const searchQuery = query.toLowerCase();
    return (
      command.label.toLowerCase().includes(searchQuery) ||
      command.description.toLowerCase().includes(searchQuery) ||
      command.keywords.some((keyword) => keyword.toLowerCase().includes(searchQuery))
    );
  });

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!show || !coords) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-50 w-80 bg-card border rounded-lg shadow-lg"
      style={{
        left: `${coords.x}px`,
        top: `${coords.y + 8}px`,
      }}
    >
      <Command>
        <CommandInput
          placeholder="Search for a command..."
          value={query}
          onValueChange={onQueryChange}
          className="border-0"
        />
        <CommandList>
          <CommandEmpty>No commands found.</CommandEmpty>
          <CommandGroup heading="Text Formatting">
            {filteredCommands
              .filter((cmd) => ["heading1", "heading2", "heading3", "paragraph"].includes(cmd.id))
              .map((command, index) => (
                <CommandItem
                  key={command.id}
                  onSelect={() => onExecute(command)}
                  className={`flex items-center gap-3 p-3 cursor-pointer ${index === 0 ? "bg-accent" : ""}`}
                >
                  {command.icon}
                  <div className="flex-1">
                    <div className="font-medium">{command.label}</div>
                    <div className="text-sm text-muted-foreground">{command.description}</div>
                  </div>
                  {index === 0 && <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">Enter</div>}
                </CommandItem>
              ))}
          </CommandGroup>
          <CommandGroup heading="Lists & Blocks">
            {filteredCommands
              .filter((cmd) =>
                ["bulletList", "orderedList", "blockquote", "codeBlock", "horizontalRule"].includes(cmd.id),
              )
              .map((command) => {
                const globalIndex = filteredCommands.findIndex((cmd) => cmd.id === command.id);
                return (
                  <CommandItem
                    key={command.id}
                    onSelect={() => onExecute(command)}
                    className={`flex items-center gap-3 p-3 cursor-pointer ${globalIndex === 0 ? "bg-accent" : ""}`}
                  >
                    {command.icon}
                    <div className="flex-1">
                      <div className="font-medium">{command.label}</div>
                      <div className="text-sm text-muted-foreground">{command.description}</div>
                    </div>
                    {globalIndex === 0 && (
                      <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">Enter</div>
                    )}
                  </CommandItem>
                );
              })}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}

"use client";

import type { Editor } from "@tiptap/react";
import { useCallback, useState } from "react";
import { type SlashCommand, type SlashCommandState, slashCommands } from "./slash-commands";

export function useSlashCommand(editor: Editor | null) {
  const [state, setState] = useState<SlashCommandState>({
    show: false,
    query: "",
    position: null,
    coords: null,
  });

  const openSlashCommand = useCallback((from: number, coords: { x: number; y: number }) => {
    setState({
      show: true,
      query: "",
      position: { from: from, to: from + 1 }, // Track the slash position
      coords,
    });
  }, []);

  const closeSlashCommand = useCallback(() => {
    setState({
      show: false,
      query: "",
      position: null,
      coords: null,
    });
  }, []);

  const updateQuery = useCallback((query: string) => {
    setState((prev) => ({ ...prev, query }));
  }, []);

  const executeCommand = useCallback(
    (command: SlashCommand) => {
      if (!editor || !state.position) return;

      const { from } = state.position;
      const currentPos = editor.state.selection.from;

      // Delete the slash command text (from the slash to current cursor position)
      editor.chain().focus().deleteRange({ from, to: currentPos }).run();

      // Execute the command
      command.execute(editor);

      // Close the slash command menu
      closeSlashCommand();
    },
    [editor, state.position, closeSlashCommand],
  );

  const updateQueryFromEditor = useCallback(() => {
    if (!state.show || !state.position || !editor) return;

    const { from } = state.position;
    const currentText = editor.state.doc.textBetween(from, editor.state.selection.from);

    // Remove the slash and any leading whitespace to get the clean query
    const query = currentText.replace(/^\s*\/\s*/, "").trim();
    updateQuery(query);
  }, [state.show, state.position, editor, updateQuery]);

  // Filter commands based on current query
  const filteredCommands = slashCommands.filter((command) => {
    if (!state.query) return true;
    const searchQuery = state.query.toLowerCase();
    return (
      command.label.toLowerCase().includes(searchQuery) ||
      command.description.toLowerCase().includes(searchQuery) ||
      command.keywords.some((keyword) => keyword.toLowerCase().includes(searchQuery))
    );
  });

  return {
    state,
    filteredCommands,
    handlers: {
      onExecute: executeCommand,
      onClose: closeSlashCommand,
      onQueryChange: updateQuery,
    },
    openSlashCommand,
    updateQueryFromEditor,
  };
}

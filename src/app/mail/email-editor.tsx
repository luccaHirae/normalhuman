"use client";

import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { Text } from "@tiptap/extension-text";
import { EditorMenubar } from "@/app/mail/editor-menubar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export const EmailEditor = () => {
  const [value, setValue] = useState("");

  const CustomText = Text.extend({
    addKeyboardShortcuts() {
      return {
        "Meta-J": () => {
          return true;
        },
      };
    },
  });

  const editor = useEditor({
    autofocus: false,
    extensions: [StarterKit, CustomText],
    onUpdate: ({ editor }) => {
      setValue(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div>
      <div className="flex border-b p-4 py-2">
        <EditorMenubar editor={editor} />
      </div>

      <div className="prose w-full px-4">
        <EditorContent editor={editor} value={value} />
      </div>

      <Separator />

      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-sm">
          Tip: Press{" "}
          <kbd className="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800">
            Cmd + J
          </kbd>{" "}
          for AI autocomplete
        </span>

        <Button>Send</Button>
      </div>
    </div>
  );
};

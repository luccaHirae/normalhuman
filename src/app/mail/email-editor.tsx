"use client";

import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { Text } from "@tiptap/extension-text";
import { EditorMenubar } from "@/app/mail/editor-menubar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TagInput } from "@/app/mail/tag-input";
import { type Value } from "@/types";

interface Props {
  subject: string;
  setSubject: (subject: string) => void;
  toValues: Value[];
  setToValues: (values: Value[]) => void;
  ccValues: Value[];
  setCcValues: (values: Value[]) => void;
  to: string[];
  handleSend: (value: string) => void;
  isSending: boolean;
  defaultToolbarExpanded?: boolean;
}

export const EmailEditor = ({
  subject,
  setSubject,
  toValues,
  setToValues,
  ccValues,
  setCcValues,
  to,
  handleSend,
  isSending,
  defaultToolbarExpanded = false,
}: Props) => {
  const [value, setValue] = useState("");
  const [expanded, setExpanded] = useState(defaultToolbarExpanded);

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
  };

  const handleClick = async () => {
    editor?.commands.clearContent();
    handleSend(value);
  };

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

      <div className="space-y-2 p-4 pb-0">
        {expanded && (
          <>
            <TagInput
              label="To"
              onChange={setToValues}
              placeholder="Add recipients"
              value={toValues}
            />

            <TagInput
              label="Cc"
              onChange={setCcValues}
              placeholder="Add recipients"
              value={ccValues}
            />

            <Input
              id="subject"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </>
        )}

        <div className="flex items-center gap-2">
          <div onClick={toggleExpanded} className="cursor-pointer">
            <span className="font-medium text-green-600">Draft</span>

            <span>to {to.join(", ")}</span>
          </div>
        </div>
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

        <Button onClick={handleClick} disabled={isSending}>
          Send
        </Button>
      </div>
    </div>
  );
};

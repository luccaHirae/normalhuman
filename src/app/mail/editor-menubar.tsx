import { type Editor } from "@tiptap/react";
import { type Level } from "@tiptap/extension-heading";
import {
  BoldIcon,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo,
  Strikethrough,
  Undo,
} from "lucide-react";

interface Props {
  editor: Editor;
}

export const EditorMenubar = ({ editor }: Props) => {
  const handleBold = () => {
    editor.chain().focus().toggleBold().run();
  };

  const handleItalic = () => {
    editor.chain().focus().toggleItalic().run();
  };

  const handleStrike = () => {
    editor.chain().focus().toggleStrike().run();
  };

  const handleCode = () => {
    editor.chain().focus().toggleCode().run();
  };

  const handleHeading = (level: Level) => {
    editor.chain().focus().toggleHeading({ level }).run();
  };

  const handleBulletList = () => {
    editor.chain().focus().toggleBulletList().run();
  };

  const handleOrderedList = () => {
    editor.chain().focus().toggleOrderedList().run();
  };

  const handleBlockquote = () => {
    editor.chain().focus().toggleBlockquote().run();
  };

  const handleUndo = () => {
    editor.chain().focus().undo().run();
  };

  const handleRedo = () => {
    editor.chain().focus().redo().run();
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={handleBold}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
      >
        <BoldIcon className="size-4 text-secondary-foreground" />
      </button>

      <button
        onClick={handleItalic}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "is-active" : ""}
      >
        <Italic className="size-4 text-secondary-foreground" />
      </button>

      <button
        onClick={handleStrike}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? "is-active" : ""}
      >
        <Strikethrough className="size-4 text-secondary-foreground" />
      </button>

      <button
        onClick={handleCode}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={editor.isActive("code") ? "is-active" : ""}
      >
        <Code className="size-4 text-secondary-foreground" />
      </button>

      <button
        onClick={() => handleHeading(1)}
        className={editor.isActive("heading", { level: 1 }) ? "is-active" : ""}
      >
        <Heading1 className="size-4 text-secondary-foreground" />
      </button>

      <button
        onClick={() => handleHeading(2)}
        className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
      >
        <Heading2 className="size-4 text-secondary-foreground" />
      </button>

      <button
        onClick={() => handleHeading(3)}
        className={editor.isActive("heading", { level: 3 }) ? "is-active" : ""}
      >
        <Heading3 className="size-4 text-secondary-foreground" />
      </button>

      <button
        onClick={() => handleHeading(4)}
        className={editor.isActive("heading", { level: 4 }) ? "is-active" : ""}
      >
        <Heading4 className="size-4 text-secondary-foreground" />
      </button>

      <button
        onClick={() => handleHeading(5)}
        className={editor.isActive("heading", { level: 5 }) ? "is-active" : ""}
      >
        <Heading5 className="size-4 text-secondary-foreground" />
      </button>

      <button
        onClick={() => handleHeading(6)}
        className={editor.isActive("heading", { level: 6 }) ? "is-active" : ""}
      >
        <Heading6 className="size-4 text-secondary-foreground" />
      </button>

      <button
        onClick={handleBulletList}
        className={editor.isActive("bulletList") ? "is-active" : ""}
      >
        <List className="size-4 text-secondary-foreground" />
      </button>

      <button
        onClick={handleOrderedList}
        className={editor.isActive("orderedList") ? "is-active" : ""}
      >
        <ListOrdered className="size-4 text-secondary-foreground" />
      </button>

      <button
        onClick={handleBlockquote}
        className={editor.isActive("blockquote") ? "is-active" : ""}
      >
        <Quote className="size-4 text-secondary-foreground" />
      </button>

      <button
        onClick={handleUndo}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        <Undo className="size-4 text-secondary-foreground" />
      </button>

      <button
        onClick={handleRedo}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        <Redo className="size-4 text-secondary-foreground" />
      </button>
    </div>
  );
};

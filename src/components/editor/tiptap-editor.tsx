"use client";
import { EditorContent } from "@tiptap/react";
import { useTiptapEditor } from "./useTiptap";
import { EditorToolbar } from "./toolbar/editor-toolbar";

interface RichTextEditorProps {
  value?: string; // allow undefined
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value = "",
  onChange,
  disabled,
}) => {
  const editor = useTiptapEditor({
    content: value,
    editable: !disabled,
    onChange,
  });

  return (
    <div className="p-4 w-full mx-auto">
      <div
        className={`border rounded-lg overflow-hidden bg-white ${
          disabled ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        <EditorToolbar editor={editor} />

        <div className="p-4 min-h-[200px] overflow-y-auto">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;

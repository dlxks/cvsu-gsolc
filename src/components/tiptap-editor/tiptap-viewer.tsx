"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface TiptapViewerProps {
  content: string; // HTML string
}

export default function TiptapViewer({ content }: TiptapViewerProps) {
  const editor = useEditor({
    editable: false, // read-only
    extensions: [StarterKit],
    content: content || "<p>No content</p>", // use your saved HTML
    immediatelyRender: false,
  });

  return <EditorContent editor={editor} />;
}

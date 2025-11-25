"use client";

import { useState } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

interface UseTiptapProps {
  content: string;
  editable?: boolean;
  onChange?: (html: string) => void;
}

export const useTiptapEditor = ({
  content,
  editable = true,
  onChange,
}: UseTiptapProps) => {
  // Used to force React re-render for active button states
  const [, setRerender] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4, 5, 6] } }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: true, defaultProtocol: "https" }),
      Image.configure({ inline: true, allowBase64: true }),
    ],

    content,
    editable,

    onCreate() {
      // 🔥 Trigger initial rerender so active states are correct immediately
      setRerender(v => !v);
    },

    onSelectionUpdate() {
      // 🔥 Update toolbar when cursor moves
      setRerender(v => !v);
    },

    onUpdate({ editor }) {
      onChange?.(editor.getHTML());
      // 🔥 Update toolbar when content changes
      setRerender(v => !v);
    },

    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-full min-h-[200px]",
      },
    },

    // 🔥 MUST be false in Next.js (SSR compatibility)
    immediatelyRender: false,
  });

  return editor;
};

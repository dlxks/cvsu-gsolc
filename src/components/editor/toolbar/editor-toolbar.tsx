import React, { useState } from "react";
import { Editor } from "@tiptap/react";
import { Button } from "@/src/components/ui/button";
import { ToolbarDivider, ToolbarGroup } from "@/src/components/ui/toolbar";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
} from "lucide-react";
import { HeadingDropdown } from "./heading-dropdown";
import { LinkModal } from "../modals/link-modal";
import { ImageModal } from "../modals/image-modal";

interface EditorToolbarProps {
  editor: Editor | null;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor }) => {
  const [isLinkOpen, setLinkOpen] = useState(false);
  const [isImageOpen, setImageOpen] = useState(false);

  if (!editor) return null;

  const btnClass = (active: boolean) =>
    `p-2 rounded-md ${active ? "bg-blue-500 text-white" : "hover:bg-gray-300"}`;

  return (
    <>
      <div className="flex flex-wrap gap-2 border rounded-t-lg">
        {/* Undo/Redo */}
        <ToolbarGroup>
          <Button
            type="button"
            variant="ghost"
            className={btnClass(false)}
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo size={18} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            className={btnClass(false)}
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo size={18} />
          </Button>
        </ToolbarGroup>

        <ToolbarDivider />

        {/* Text styles */}
        <HeadingDropdown editor={editor} />

        <ToolbarGroup>
          <Button
            type="button"
            variant="ghost"
            className={btnClass(editor.isActive("bold"))}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold size={18} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            className={btnClass(editor.isActive("italic"))}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic size={18} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            className={btnClass(editor.isActive("underline"))}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <Underline size={18} />
          </Button>
        </ToolbarGroup>

        <ToolbarDivider />

        {/* List */}
        <ToolbarGroup>
          <Button
            type="button"
            variant="ghost"
            className={btnClass(editor.isActive("bulletList"))}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List size={18} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            className={btnClass(editor.isActive("orderedList"))}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered size={18} />
          </Button>
        </ToolbarGroup>

        <ToolbarDivider />

        {/* Alignments */}
        <ToolbarGroup>
          <Button
            type="button"
            variant="ghost"
            className={btnClass(editor.isActive({ textAlign: "left" }))}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          >
            <AlignLeft size={18} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            className={btnClass(editor.isActive({ textAlign: "center" }))}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          >
            <AlignCenter size={18} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            className={btnClass(editor.isActive({ textAlign: "right" }))}
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          >
            <AlignRight size={18} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            className={btnClass(editor.isActive({ textAlign: "justify" }))}
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          >
            <AlignJustify size={18} />
          </Button>
        </ToolbarGroup>

        <ToolbarDivider />

        {/* Custom */}
        <ToolbarGroup>
          <Button
            type="button"
            variant="ghost"
            className={btnClass(editor.isActive("link"))}
            onClick={() => setLinkOpen(true)}
          >
            <LinkIcon size={18} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            className={btnClass(false)}
            onClick={() => setImageOpen(true)}
          >
            <ImageIcon size={18} />
          </Button>
        </ToolbarGroup>
      </div>

      <LinkModal editor={editor} open={isLinkOpen} onOpenChange={setLinkOpen} />
      <ImageModal
        editor={editor}
        open={isImageOpen}
        onOpenChange={setImageOpen}
      />
    </>
  );
};

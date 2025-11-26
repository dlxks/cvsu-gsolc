"use client";

import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import type { Editor } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { CharacterCount } from "@tiptap/extensions";
import TextAlign from "@tiptap/extension-text-align";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";

import {
  ChevronDown,
  Bold,
  Italic,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Code,
  Quote,
  Underline,
  Undo,
  Redo,
  Trash2,
  Pilcrow,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  LucideProps,
} from "lucide-react";
import { Toolbar, ToolbarDivider, ToolbarGroup } from "../ui/toolbar";
import React from "react";

type HeadingType = "paragraph" | 1 | 2 | 3 | 4 | 5 | 6;
const HeadingIcons: Record<HeadingType, React.FC<LucideProps>> = {
  paragraph: Pilcrow,
  1: Heading1,
  2: Heading2,
  3: Heading3,
  4: Heading4,
  5: Heading5,
  6: Heading6,
};
const HEADING_LEVELS = [1, 2, 3, 4, 5, 6] as const;
const CHAR_LIMIT = 1000;

interface TiptapProps {
  value?: string; // HTML content
  onChange?: (value: string) => void;
}

export default function Tiptap({
  value = "<p>Enter text...</p>",
  onChange,
}: TiptapProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      CharacterCount.configure({ limit: CHAR_LIMIT }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value, // Use HTML directly
    editorProps: {
      attributes: {
        class:
          "tiptap prose-sm sm:prose lg:prose-lg focus:outline-none max-w-full min-h-[200px]",
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML()); // ✅ Store HTML instead of JSON
    },
    immediatelyRender: false,
  });

  const { charactersCount = 0, wordsCount = 0 } = useEditorState({
    editor,
    selector: (ctx) => {
      if (!ctx.editor) return { charactersCount: 0, wordsCount: 0 };
      return {
        charactersCount: ctx.editor.storage.characterCount.characters(),
        wordsCount: ctx.editor.storage.characterCount.words(),
      };
    },
  }) ?? { charactersCount: 0, wordsCount: 0 };

  if (!editor)
    return <div className="p-4 w-full mx-auto">Loading editor...</div>;

  const MenuBar = ({ editor }: { editor: Editor }) => {
    const state = useEditorState({
      editor,
      selector: (ctx) => {
        const e = ctx.editor;
        const activeHeading = e.isActive("paragraph")
          ? "paragraph"
          : HEADING_LEVELS.find((lvl) =>
              e.isActive("heading", { level: lvl })
            ) ?? "paragraph";

        return {
          canUndo: e.can().chain().undo().run(),
          canRedo: e.can().chain().redo().run(),
          isBold: e.isActive("bold"),
          isItalic: e.isActive("italic"),
          isUnderline: e.isActive("underline"),
          isStrike: e.isActive("strike"),
          activeHeading,
          headingLabel:
            activeHeading === "paragraph"
              ? "Paragraph"
              : `Heading ${activeHeading}`,
          isBulletList: e.isActive("bulletList"),
          isOrderedList: e.isActive("orderedList"),
          isCodeBlock: e.isActive("codeBlock"),
          isBlockquote: e.isActive("blockquote"),
          textAlign: e.getAttributes("paragraph").textAlign || "left",
        };
      },
    });

    const MARKS = [
      {
        icon: <Bold size={16} />,
        tooltip: "Bold",
        command: () => editor.chain().focus().toggleBold().run(),
        isActive: state.isBold,
      },
      {
        icon: <Italic size={16} />,
        tooltip: "Italic",
        command: () => editor.chain().focus().toggleItalic().run(),
        isActive: state.isItalic,
      },
      {
        icon: <Underline size={16} />,
        tooltip: "Underline",
        command: () => editor.chain().focus().toggleUnderline().run(),
        isActive: state.isUnderline,
      },
      {
        icon: <Strikethrough size={16} />,
        tooltip: "Strike",
        command: () => editor.chain().focus().toggleStrike().run(),
        isActive: state.isStrike,
      },
    ];

    const ALIGNMENTS = [
      { icon: <AlignLeft size={16} />, align: "left", tooltip: "Align Left" },
      {
        icon: <AlignCenter size={16} />,
        align: "center",
        tooltip: "Align Center",
      },
      {
        icon: <AlignRight size={16} />,
        align: "right",
        tooltip: "Align Right",
      },
      {
        icon: <AlignJustify size={16} />,
        align: "justify",
        tooltip: "Justify",
      },
    ];

    const LISTS = [
      {
        icon: <List size={16} />,
        type: "bulletList",
        tooltip: "Bullet List",
        isActive: state.isBulletList,
        command: () => editor.chain().focus().toggleBulletList().run(),
      },
      {
        icon: <ListOrdered size={16} />,
        type: "orderedList",
        tooltip: "Ordered List",
        isActive: state.isOrderedList,
        command: () => editor.chain().focus().toggleOrderedList().run(),
      },
    ];

    const BLOCKS = [
      {
        icon: <Code size={16} />,
        type: "codeBlock",
        tooltip: "Code Block",
        isActive: state.isCodeBlock,
        command: () => editor.chain().focus().toggleCodeBlock().run(),
      },
      {
        icon: <Quote size={16} />,
        type: "blockquote",
        tooltip: "Blockquote",
        isActive: state.isBlockquote,
        command: () => editor.chain().focus().toggleBlockquote().run(),
      },
    ];

    const ActiveIcon = HeadingIcons[state.activeHeading as HeadingType];

    return (
      <Toolbar dense>
        <ToolbarGroup>
          <Button
            title="Undo"
            variant="ghost"
            disabled={!state.canUndo}
            onClick={() => editor.chain().focus().undo().run()}
          >
            <Undo size={16} />
          </Button>
          <Button
            title="Redo"
            variant="ghost"
            disabled={!state.canRedo}
            onClick={() => editor.chain().focus().redo().run()}
          >
            <Redo size={16} />
          </Button>
        </ToolbarGroup>

        <ToolbarDivider />

        <ToolbarGroup>
          {/* Headings */}
          {/* Headings */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1">
                <ActiveIcon size={16} />
                {state.headingLabel}
                <ChevronDown size={14} />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="min-w-max">
              {/* Paragraph */}
              <DropdownMenuItem
                onClick={() => editor.chain().focus().setParagraph().run()}
                className={`flex items-center gap-2 ${
                  state.activeHeading === "paragraph" ? "bg-gray-200" : ""
                }`}
              >
                <Pilcrow size={16} />
                Paragraph
              </DropdownMenuItem>

              {/* Headings */}
              {HEADING_LEVELS.map((level) => {
                const Icon = HeadingIcons[level];
                return (
                  <DropdownMenuItem
                    key={level}
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level }).run()
                    }
                    className={`flex items-center gap-2 ${
                      state.activeHeading === level ? "bg-gray-200" : ""
                    }`}
                  >
                    <Icon size={16} />
                    Heading {level}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </ToolbarGroup>

        <ToolbarDivider />

        <ToolbarGroup>
          {MARKS.map(({ icon, tooltip, command, isActive }) => (
            <Button
              key={tooltip}
              type="button"
              variant={isActive ? "default" : "ghost"}
              onClick={command}
              title={tooltip}
            >
              {icon}
            </Button>
          ))}
        </ToolbarGroup>

        <ToolbarDivider />

        <ToolbarGroup>
          {/* Lists */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1">
                <List size={16} /> <ChevronDown size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-max">
              {LISTS.map(({ icon, tooltip, command, type, isActive }) => (
                <DropdownMenuItem
                  key={type}
                  title={tooltip}
                  onClick={command}
                  className={isActive ? "bg-gray-200" : ""}
                >
                  {icon}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Alignments */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1">
                <AlignLeft size={16} /> <ChevronDown size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-max">
              {ALIGNMENTS.map(({ icon, align, tooltip }) => (
                <DropdownMenuItem
                  key={align}
                  title={tooltip}
                  onClick={() =>
                    editor.chain().focus().setTextAlign(align).run()
                  }
                  className={state.textAlign === align ? "bg-gray-200" : ""}
                >
                  {icon}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Blocks */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1 w-fit">
                <Code size={16} /> <ChevronDown size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-max">
              {BLOCKS.map(({ icon, tooltip, command, type, isActive }) => (
                <DropdownMenuItem
                  key={type}
                  title={tooltip}
                  onClick={command}
                  className={isActive ? "bg-gray-200" : ""}
                >
                  {icon}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </ToolbarGroup>
      </Toolbar>
    );
  };

  const BottomControls = ({ editor }: { editor: Editor }) => {
    const state = useEditorState({
      editor,
      selector: (ctx) => {
        const e = ctx.editor;
      },
    });

    return (
      <Button
        title="Clear Contents"
        type="button"
        variant="ghost"
        onClick={() => editor.chain().clearContent().run()}
      >
        <Trash2 size={16} />
      </Button>
    );
  };

  return (
    <div className="p-4 w-full mx-auto">
      <div className="border rounded-lg overflow-hidden bg-white">
        <MenuBar editor={editor} />
        <div className="p-4 min-h-[200px]">
          <EditorContent editor={editor} />

          <div className="flex items-center justify-between">
            {/* Counts */}
            <div className="mt-2 text-sm text-gray-500 flex justify-end gap-4">
              <span>
                Characters: {charactersCount} / {CHAR_LIMIT}
              </span>
              <span>Words: {wordsCount}</span>
            </div>

            {/* Bottom controls */}
            <BottomControls editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );
}

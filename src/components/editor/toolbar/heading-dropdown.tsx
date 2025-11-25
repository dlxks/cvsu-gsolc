import React from "react";
import { Editor } from "@tiptap/react";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/src/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const HEADING_LEVELS = [1, 2, 3, 4, 5, 6] as const;

interface HeadingDropdownProps {
  editor: Editor | null;
}

export const HeadingDropdown: React.FC<HeadingDropdownProps> = ({ editor }) => {
  if (!editor) return null;

  const active = editor.isActive("paragraph")
    ? "paragraph"
    : HEADING_LEVELS.find((lvl) =>
        editor.isActive("heading", { level: lvl })
      ) ?? "paragraph";

  const getLabel = (level: (typeof HEADING_LEVELS)[number] | "paragraph") =>
    level === "paragraph" ? "Paragraph" : `Heading ${level}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="flex items-center gap-2"
        >
          {getLabel(active)}
          <ChevronDown size={14} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          Paragraph
        </DropdownMenuItem>
        {HEADING_LEVELS.map((level) => (
          <DropdownMenuItem
            key={level}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level }).run()
            }
          >
            Heading {level}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

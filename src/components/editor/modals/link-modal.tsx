import { useState, useEffect } from "react";
import { Editor } from "@tiptap/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";

interface LinkModalProps {
  editor: Editor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LinkModal: React.FC<LinkModalProps> = ({
  editor,
  open,
  onOpenChange,
}) => {
  const [url, setUrl] = useState("");

  const onSubmit = () => {
    if (!editor) return;
    if (!url) editor.chain().focus().unsetLink().run();
    else editor.chain().focus().setLink({ href: url, target: "_blank" }).run();
    setUrl("");
    onOpenChange(false);
  };

  useEffect(() => {
    if (open && editor?.isActive("link")) setUrl("https://mock-link.com");
    else setUrl("");
  }, [open, editor]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editor?.isActive("link") ? "Edit Link" : "Insert Link"}
          </DialogTitle>
        </DialogHeader>
        <Input
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <DialogFooter className="flex gap-2">
          {editor?.isActive("link") && (
            <Button
              variant="destructive"
              onClick={() => editor.chain().focus().unsetLink().run()}
            >
              Remove
            </Button>
          )}
          <Button onClick={onSubmit}>
            {editor?.isActive("link") ? "Update" : "Insert"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

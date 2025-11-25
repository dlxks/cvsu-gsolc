import { useState } from "react";
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

interface ImageModalProps {
  editor: Editor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  editor,
  open,
  onOpenChange,
}) => {
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const insertByUrl = () => {
    if (!editor || !url) return;
    editor.chain().focus().setImage({ src: url }).run();
    setUrl("");
    setFile(null);
    onOpenChange(false);
  };

  const insertByFile = () => {
    if (!editor || !file) return;
    const reader = new FileReader();
    reader.onload = () => {
      editor
        .chain()
        .focus()
        .setImage({ src: reader.result as string })
        .run();
      setFile(null);
      setUrl("");
      onOpenChange(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Insert Image</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2 mb-4">
          <Input
            placeholder="Paste image URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button onClick={insertByUrl} disabled={!url}>
            Insert via URL
          </Button>
        </div>

        <div className="text-center text-sm text-gray-500 mb-4">OR</div>

        <div className="flex flex-col gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-gray-500 file:py-2 file:px-4 file:rounded-full file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <Button onClick={insertByFile} disabled={!file}>
            Insert from File
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

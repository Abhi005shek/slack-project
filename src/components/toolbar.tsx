import { MessageSquareTextIcon, Pencil, Smile, Trash } from "lucide-react";
import { Button } from "./ui/button";
import Hint from "./hint";
import EmojiPopover from "./emoji-popover";

interface ToolbarProps {
  isAuthor: boolean;
  isPending: boolean;
  handleEdit: () => void;
  handleThread: () => void;
  handleDelete: () => void;
  handleReaction: (val: string) => void;
  hideThreadButton?: boolean;
}
function Toolbar({
  isAuthor,
  isPending,
  handleEdit,
  handleThread,
  handleDelete,
  handleReaction,
  hideThreadButton,
}: ToolbarProps) {
  return (
    <div className="absolute top-0 right-5">
      <div className="group-hover:opacity-100 opacity-0 transition-opacity border bg-white rouneded-md shadow-sm">
        <EmojiPopover
          hint="Add reaction"
          onEmojiSelect={(emoji) => handleReaction(emoji.native)}
        >
          <Button variant={"ghost"} size={"iconSm"} disabled={isPending}>
            <Smile className="size-4" />
          </Button>
        </EmojiPopover>

        {!hideThreadButton && (
          <Hint label="Reply in thread">
            <Button
            onClick={handleThread}
            variant={"ghost"} size={"iconSm"} disabled={isPending}>
              <MessageSquareTextIcon className="size-4" />
            </Button>
          </Hint>
        )}

        {isAuthor && (
          <>
            <Hint label="Edit message">
              <Button 
              onClick={handleEdit}
              variant={"ghost"} size={"iconSm"} disabled={isPending}>
                <Pencil className="size-4" />
              </Button>
            </Hint>

            <Hint label="Delete message">
              <Button 
              onClick={handleDelete}
              variant={"ghost"} size={"iconSm"} disabled={isPending}>
                <Trash className="size-4" />
              </Button>
            </Hint>
          </>
        )}
      </div>
    </div>
  );
}

export default Toolbar;

import useWorkspaceId from "@/hooks/use-workspace-id";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { cn } from "@/lib/utils";
import Hint from "./hint";
import EmojiPopover from "./emoji-popover";
import { MdOutlineAddReaction } from "react-icons/md";

interface ReactionsProps {
  data: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  onChange: (value: string) => void;
}

export default function Reactions({ data, onChange }: ReactionsProps) {
  const workspaceId = useWorkspaceId();
  const { data: currentMember } = useCurrentMember({ workspaceId });
  const currentMemberId = currentMember?._id;

  if (data.length === 0 || !currentMemberId) return null;

  return (
    <div className="flex items-center mt-1 mb-1 gap-1">
      {data.map((reaction) => {
        return (
          <Hint
            key={reaction._id}
            label={`${reaction.count} ${reaction.count === 1 ? "person" : "people"} reacted with ${reaction.value}`}
          >
            <button
              onClick={() => onChange(reaction.value)}
              className={cn(
                "h-6 px-2 rounded-full border bg-slate-200/70 border-transparent text-slate-800  flex items-center gap-x-1",
                reaction.memberIds.includes(currentMemberId) &&
                  "bg-blue-100/70  border-blue-500 text-white"
              )}
            >
              {reaction.value}
              <span
                className={cn(
                  "text-xs font-semibold text-muted-foreground",
                  reaction.memberIds.includes(currentMemberId) &&
                    "text-blue-500"
                )}
              >
                {reaction.count}
              </span>
            </button>
          </Hint>
        );
      })}
      <EmojiPopover
        hint="Add reaction"
        onEmojiSelect={(emoji) => onChange(emoji.native)}
      >
        <button className="flex items-center justify-center gap-x-1 size-6 rounded-full bg-slate-200/70 border border-transparent hover:border-slate-500 text-slate-800">
          <MdOutlineAddReaction className="size-4" />
        </button>
      </EmojiPopover>
    </div>
  );
}

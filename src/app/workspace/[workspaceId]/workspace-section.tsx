import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import { FaCaretDown } from "react-icons/fa";
import { useToggle } from "react-use";

interface WorkspaceSection {
  children: React.ReactNode;
  label: string;
  hint: string;
  onNew?: () => void;
}
function WorkspaceSection({ children, label, hint, onNew }: WorkspaceSection) {
  const [on, toggle] = useToggle(true);
  return (
    <div className="flex w-full flex-col mt-3 px-2">
      <div className="flex justify-start items-center px-[5px] group">
        <Button
          variant={"transparent"}
          className="p-0.5 text-sm text-[#f9edffcc] shrink-0 size-6"
          onClick={toggle}
        >
          <FaCaretDown className={cn("size-4 transition-transform", on && "rotate-180")} />
        </Button>
        <Button
          variant={"transparent"}
          className="group px-1.5 text-sm h-[28px] justify-start overflow-hidden items-center"
        >
          <span className="truncate">{label}</span>
        </Button>

        {onNew && (
          <Hint label={hint} side="top" align="center">
            <Button
              onClick={onNew}
              variant={"transparent"}
              size={"sm"}
              className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto p-0.5 text-sm text-[#f9edffcc] size-6 shrink-0"
            >
              <PlusIcon className="size-5" />
            </Button>
          </Hint>
        )}
      </div>
      {on && children}
    </div>
  );
}

export default WorkspaceSection;

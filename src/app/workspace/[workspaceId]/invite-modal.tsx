import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNewJoinCode } from "@/features/workspaces/api/use-new-join-code";
import { useConfirm } from "@/hooks/use-confirm";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { CopyIcon, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

type InviteModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  joincode: string;
};

function InviteModal({ open, setOpen, name, joincode }: InviteModalProps) {
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useNewJoinCode();
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you Sure?",
    "This will deactivate the current invite code and generate a new one."
  );

  async function handleNewCode() {
    const ok = await confirm();
    if (!ok) return;

    mutate(
      {
        workspaceId,
      },
      {
        onSuccess: () => toast.success("New invite code generated"),
        onError: () => toast.error("Failed to regenerate invite code"),
      }
    );
  }

  function handleCopy() {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`;

    navigator.clipboard
      .writeText(inviteLink)
      .then(() => toast.success("Invite link copied to clipboard"));
  }

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite people to your {name}</DialogTitle>
            <DialogDescription>
              Use the code given below to invite people to this workspace
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-y-4 items-center justify-center py-10">
            <p className="font-mono text-4xl font-bold tracking-widest uppercase">
              {joincode}
            </p>
            <Button onClick={handleCopy} variant={"ghost"} size={"sm"}>
              Copy link
              <CopyIcon className="size-5 ml-2" />
            </Button>
          </div>

          <div className="flex items-center justify-between w-full">
            <Button
              disabled={isPending}
              onClick={handleNewCode}
              variant={"outline"}
            >
              New Code
              <RefreshCcw className="size-4 ml-2" />
            </Button>

            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default InviteModal;

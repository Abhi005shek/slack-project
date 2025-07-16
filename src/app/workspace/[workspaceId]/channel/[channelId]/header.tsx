import { Button } from "@/components/ui/button";
import { FaChevronDown } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogClose,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useUpdateChannel } from "@/features/channels/api/use-update-channel";
import { useRemoveChannel } from "@/features/channels/api/use-remove-channel";
import useChannelId from "@/hooks/use-channel-id";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/features/members/api/use-current-member";

interface HeaderProps {
  name: string;
}

function Header({ name }: HeaderProps) {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { data: member } = useCurrentMember({ workspaceId });
  const [editOpen, setEditOpen] = useState(false);
  const [value, setValue] = useState(name);
  const [Confirm, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this channel.This action is irreversible"
  );
  const channelId = useChannelId();
  const { mutate: updateChannel, isPending: isUpdatingChannel } =
    useUpdateChannel();
  const { mutate: removeChannel, isPending: isDeletingChannel } =
    useRemoveChannel();

  function handleEditOpen() {
    if (member?.role !== "admin") return;
    setEditOpen(!editOpen);
  }

  async function handleDelete() {
    const ok = await confirm();
    if (!ok) return;

    removeChannel(
      {
        id: channelId,
      },
      {
        onSuccess() {
          toast.success("Channel deleted successfully");
          router.push(`/workspace/${workspaceId}`);
        },
        onError() {
          toast.error("Failed to delete channel");
        },
      }
    );
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setValue(value);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    updateChannel(
      {
        id: channelId,
        name: value,
      },
      {
        onSuccess() {
          toast.success("Channel Updated");
          setEditOpen(false);
        },
        onError() {
          toast.error("Failed to update a channel");
        },
      }
    );
  }

  return (
    <>
      <Confirm />
      <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant={"ghost"}
              className="textlg font-semibold px-2 overflow-hidden w-auto"
              size="sm"
            >
              <span className="truncate"># {name}</span>
              <FaChevronDown className="size-2.5 ml-2" />
            </Button>
          </DialogTrigger>
          <DialogContent className="p-0 bg-gray-50 overflow-hidden">
            <DialogHeader className="p-4 border-b bg-white">
              <DialogTitle># {name}</DialogTitle>
            </DialogHeader>

            <div className="px-4 flex flex-col pb-4 gap-y-2">
              <Dialog open={editOpen} onOpenChange={handleEditOpen}>
                <DialogTrigger asChild>
                  <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">Channel Name</p>
                      {member?.role === "admin" && (
                        <p className="text-sm text-[#1264a3] hover:underline">
                          Edit
                        </p>
                      )}
                    </div>
                    <p className="text-sm">{name}</p>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Rename this channel</DialogTitle>
                  </DialogHeader>
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <Input
                      value={value}
                      onChange={handleChange}
                      autoFocus
                      disabled={isUpdatingChannel}
                      min={3}
                      maxLength={18}
                      placeholder="e.g. plan-budget"
                    />
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button
                          variant={"outline"}
                          disabled={isUpdatingChannel}
                        >
                          Cancel
                        </Button>
                      </DialogClose>

                      <Button disabled={isUpdatingChannel}>Save</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              {member?.role === "admin" && (
                <button
                  onClick={handleDelete}
                  disabled={isDeletingChannel}
                  className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600"
                >
                  <TrashIcon className="size-4" />
                  <p className="text-sm font-semibold">Delete Channel</p>
                </button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export default Header;

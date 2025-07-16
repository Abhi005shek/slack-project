"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateChannelModal } from "../store/use-create-channel-modal";
import { useCreateChannel } from "../api/use-create-channel";
import useWorkspaceId from "@/hooks/use-workspace-id";

function CreateChannelModal() {
  const router = useRouter();
  const [open, setOpen] = useCreateChannelModal();
  const [name, setName] = useState("");
  const { mutate, isPending } = useCreateChannel();
  const workspaceId = useWorkspaceId();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setName(value);
  }

  function handleClose() {
    setOpen(false);
    setName("");
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutate(
      {
        name,
        workspaceId,
      },
      {
        onSuccess(id) {
          toast.success("Channel Created");
          router.push(`/workspace/${workspaceId}/channel/${id}`);
          handleClose();
        },
        onError() {
          toast.error("Failed to create a channel");
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a channel</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={name}
            onChange={handleChange}
            disabled={isPending}
            required
            autoFocus
            minLength={3}
            maxLength={80}
            placeholder="e.g. plan-budget"
          />
          <div className="flex justify-end">
            <Button disabled={isPending}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateChannelModal;

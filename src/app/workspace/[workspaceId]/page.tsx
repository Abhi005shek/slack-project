"use client";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { Loader, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";

function page() {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });
  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId,
  });

  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  });

  const [open, setOpen] = useCreateChannelModal();

  const channelId = useMemo(() => channels?.[0]?._id, [channels]);
  const isAdmin = useMemo(() => member?.role === "admin", [member?.role]);

  const isLoading = workspaceLoading || memberLoading || channelsLoading;
  useEffect(() => {
    if (isLoading || !workspace || !member) {
      return;
    }
    if (channelId) {
      router.push(`/workspace/${workspaceId}/channel/${channelId}`);
    } else if (!open && isAdmin) {
      setOpen(true);
    }
  }, [
    channelId,
    member,
    isAdmin,
    memberLoading,
    workspaceLoading,
    channelsLoading,
    workspace,
    workspaceId,
    router,
    open,
    setOpen,
  ]);

  if (workspaceLoading || channelsLoading || memberLoading) {
    return (
      <div className="flex flex-col h-full gap-y-2 items-center justify-center flex-1">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!workspace || !member) {
    return (
      <div className="flex flex-col h-full gap-y-2 items-center justify-center flex-1">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Workspace not found.
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-y-2 items-center justify-center flex-1">
      <TriangleAlert className="size-6 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">
        No Channel not found.
      </span>
    </div>
  );
}

export default page;

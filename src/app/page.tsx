"use client";
import UserButton from "@/features/auth/components/user-button";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { data, isLoading } = useGetWorkspaces();
  const workspaceId = useMemo(() => data?.[0]?._id, [data]);
  const [open, setOpen] = useCreateWorkspaceModal();

  useEffect(() => {
    if (isLoading) return;
    if (workspaceId) {
      router.replace(`/workspace/${workspaceId}`);
    } else if (!open) {
      setOpen(true);
      console.log("open creation modal");
    }
  }, [workspaceId, isLoading, open, setOpen, router]);

  return (
    <div className="h-full flex flex-col gap-y-2 items-center justify-center">
      {/* <UserButton /> */}
      <Loader className="size-9 animate-spin text-muted-foreground" />
      <p className="text-sm text-muted-foreground">Please wait...</p>  
  </div>
  );
}

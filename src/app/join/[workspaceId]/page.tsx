"use client";
import { Button } from "@/components/ui/button";
import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info";
import { useJoin } from "@/features/workspaces/api/use-join";
// import { useNewJoinCode } from "@/features/workspaces/api/use-new-join-code";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import VerificationInput from "react-verification-input";
import { toast } from "sonner";

function Join() {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useJoin();
  const { data, isLoading } = useGetWorkspaceInfo({ id: workspaceId });

  const isMember = useMemo(() => data?.isMember, [data?.isMember]);

  useEffect(() => {
    if (isMember) {
      router.push(`/workspace/${workspaceId}`);
    }
  }, [isMember, router, workspaceId]);

  function handleComplete(val: string) {
    mutate(
      {
        workspaceId,
        joinCode: val,
      },
      {
        onSuccess(id) {
          toast.success("Workspace joined.");
          router.replace(`/workspace/${id}`);
        },
        onError() {
          toast.error("Failled to join workspace.");
        },
      }
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
        <p className="">Loading...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center bg-white gap-y-8 p-8 rounded-lg shadow-sm">
      <Image src="/next.svg" alt="logo" width={60} height={60} />
      <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <h1 className="text-2xl font-bold ">Join {data?.name}</h1>
          <p className=" text-md text-muted-foreground">
            Enter the workspace code to join
          </p>
        </div>

        <VerificationInput
          onComplete={handleComplete}
          classNames={{
            container: cn(
              "flex gap-x-2",
              isPending && "opacity-50 cursor-not-allowed"
            ),
            character:
              "uppercase bg-black h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-500",
            characterInactive: "bg-muted",
            characterSelected: "bg-white text-black",
            characterFilled: "bg-white text-black",
          }}
          autoFocus
          length={6}
        />
      </div>

      <div className="flex ga-x-4">
        <Button size={"lg"} variant={"outline"} asChild>
          <Link href={"/"}>Back To Home</Link>
        </Button>
      </div>
    </div>
  );
}

export default Join;

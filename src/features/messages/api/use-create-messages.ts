import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { useCallback, useMemo, useState } from "react";

type RequestType = {
  body: string;
  image?: Id<"_storage">;
  workspaceId: Id<"workspaces">;
  channelId?: Id<"channels">;
  parentMessageId?: Id<"messages">;
  conversationId?: Id<"conversations">;
};
type ResponseType = Id<"messages"> | null;

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const useCreateMessage = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);

  // const [isPending, setIspending] = useState(false);
  // const [isSuccess, setIsSuccess] = useState(false);
  // const [isError, setIsError] = useState(false);
  // const [isSettled, setIsSettled] = useState(false);

  const [status, setStatus] = useState<
    "success" | "error" | "settled" | "pending" | null
  >(null);
  const isPending = useMemo(() => status === "pending", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);

  const mutation = useMutation(api.messages.create);

  const mutate = useCallback(
    async (values: RequestType, options?: Options) => {
      try {
        setData(null);
        setError(null);

        setStatus("pending");
        const response = await mutation(values);
        options?.onSuccess?.(response);
        return response;
      } catch (error: Error) {
        setStatus("error");
        options?.onError?.(error);
        if (options?.throwError) {
          return error;
        }
      } finally {
        setStatus("settled");
        options?.onSettled?.();
      }
    },
    [mutation]
  );
  return { mutate, data, error, isError, isPending, isSettled, isSuccess };
};

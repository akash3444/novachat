"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { deleteChatById } from "@/utils/db/chat";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash } from "lucide-react";
import { toast } from "sonner";

export function DeleteChatButtonWithDialog({
  id,
  title,
  onDelete,
}: {
  id: string;
  title: string;
  onDelete?: (id: string) => void;
}) {
  const queryClient = useQueryClient();
  const { mutateAsync: deleteChat, isPending: isDeleting } = useMutation({
    mutationFn: async () => await deleteChatById(id),
    onSuccess: () => {
      // Optimistically update the chat list
      queryClient.setQueryData(
        ["chats"],
        (oldChats: {
          pages: {
            data: { id: string; title: string; is_pinned: boolean }[];
            count: number;
          }[];
        }) => ({
          ...oldChats,
          pages: oldChats.pages.map((page) => ({
            ...page,
            data: page.data.filter((chat) => chat.id !== id),
            count: page.count - 1,
          })),
        })
      );

      toast.success("Chat deleted successfully!");

      onDelete?.(id);
    },
  });

  const handleDeleteChat = async () => {
    await deleteChat();
  };

  return (
    <AlertDialog>
      <Tooltip>
        <AlertDialogTrigger asChild>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="size-5">
              <Trash />
            </Button>
          </TooltipTrigger>
        </AlertDialogTrigger>
        <TooltipContent>Delete chat</TooltipContent>
      </Tooltip>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the chat{" "}
            &quot;<span className="font-semibold">{title}</span>&quot; and all
            its messages.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={handleDeleteChat} disabled={isDeleting}>
            {isDeleting ? <Loader2 className="animate-spin" /> : <Trash />}{" "}
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

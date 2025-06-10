"use client";

import { deleteChatById } from "@/utils/db/chat";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
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
      queryClient.setQueryData(["chats"], (oldChats: { id: string }[]) => {
        if (!oldChats) {
          queryClient.invalidateQueries({ queryKey: ["chats"] });
          return [];
        }

        return oldChats.filter((chat) => chat.id !== id);
      });

      toast.success("Chat deleted successfully!");

      onDelete?.(id);
    },
  });

  const handleDeleteChat = async (e: React.MouseEvent<HTMLButtonElement>) => {
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
            "<span className="font-semibold">{title}</span>" and all its
            messages.
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

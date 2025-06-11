"use client";

import { Button } from "@/components/ui/button";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { updateChatPinStatus } from "@/utils/db/chat";
import { useQueryClient } from "@tanstack/react-query";
import { Pin, PinOff } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { DeleteChatButtonWithDialog } from "./delete-chat-button-with-dialog";

export const ChatItem = ({
  chat,
}: {
  chat: { id: string; title: string; is_pinned: boolean };
}) => {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const togglePinStatus = async () => {
    // Add the chat to the pinned/unpinned chats list
    queryClient.setQueryData(
      chat.is_pinned ? ["chats"] : ["pinned-chats"],
      (oldChats: { id: string; title: string; is_pinned: boolean }[]) => {
        return [
          ...oldChats,
          { id: chat.id, title: chat.title, is_pinned: !chat.is_pinned },
        ];
      }
    );

    // Remove the chat from the pinned/unpinned chats list
    queryClient.setQueryData(
      chat.is_pinned ? ["pinned-chats"] : ["chats"],
      (oldChats: { id: string; title: string; is_pinned: boolean }[]) => {
        return oldChats.filter((c) => c.id !== chat.id);
      }
    );

    await updateChatPinStatus(chat.id, !chat.is_pinned);
  };

  const onChatDeletion = () => {
    // If the deleted chat is the current chat, redirect to the home page
    if (chat.id === id) {
      router.push("/");
    }
  };

  return (
    <SidebarMenuItem key={chat.id} className="relative">
      <SidebarMenuButton
        asChild
        tooltip={chat.title}
        isActive={id === chat.id}
        className="group/menu-button"
      >
        <Link href={`/chat/${chat.id}`}>
          <span className="whitespace-nowrap grow overflow-hidden text-ellipsis">
            {chat.title}
          </span>
          <div
            className="shrink-0 bg-sidebar-accent group-hover/menu-button:flex items-center gap-1 hidden"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-5"
                  onClick={togglePinStatus}
                >
                  {chat.is_pinned ? <PinOff /> : <Pin />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {chat.is_pinned ? "Unpin chat" : "Pin chat"}
              </TooltipContent>
            </Tooltip>

            <DeleteChatButtonWithDialog
              id={chat.id}
              title={chat.title}
              onDelete={onChatDeletion}
            />
          </div>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

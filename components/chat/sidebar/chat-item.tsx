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
import { memo } from "react";

export const ChatItem = memo(
  ({ chat }: { chat: { id: string; title: string; is_pinned: boolean } }) => {
    const { id } = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();

    const togglePinStatus = async () => {
      // Update the pinned chats list
      queryClient.setQueryData(
        ["pinned-chats"],
        (oldChats: { id: string; title: string; is_pinned: boolean }[]) => {
          // Remove the chat from the pinned chats list
          if (chat.is_pinned) {
            return oldChats.filter((c) => c.id !== chat.id);
          }

          // Add the chat to the pinned chats list
          return [
            ...oldChats,
            { id: chat.id, title: chat.title, is_pinned: true },
          ];
        }
      );

      // Update the unpinned chats list
      queryClient.setQueryData(
        ["chats"],
        (oldChats: {
          pages: {
            data: { id: string; title: string; is_pinned: boolean }[];
            count: number;
          }[];
        }) => {
          const lastPage = oldChats.pages[oldChats.pages.length - 1];
          const lastPageCount = lastPage.count;

          return {
            ...oldChats,
            pages: oldChats.pages.map((page, index) => {
              const isFirstPage = index === 0;
              const unpinnedChat = { ...chat, is_pinned: false };
              const updatedChatCount = chat.is_pinned
                ? lastPageCount + 1
                : lastPageCount - 1;

              const chatsWithUnpinnedChat = isFirstPage
                ? [unpinnedChat, ...page.data]
                : page.data;
              const chatsWithoutPinnedChat = page.data.filter(
                (c) => c.id !== chat.id
              );

              return {
                ...page,
                data: chat.is_pinned
                  ? chatsWithUnpinnedChat
                  : chatsWithoutPinnedChat,
                count: updatedChatCount,
              };
            }),
          };
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
  },
  (prevProps, nextProps) => {
    return (
      prevProps.chat.id === nextProps.chat.id &&
      prevProps.chat.title === nextProps.chat.title &&
      prevProps.chat.is_pinned === nextProps.chat.is_pinned
    );
  }
);
ChatItem.displayName = "ChatItem";

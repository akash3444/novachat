"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { getUserChats } from "@/utils/db/chat";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { ChatItem } from "./chat-item";
import { ChatListSkeleton } from "./chat-list-skeleton";

export function ChatList({
  chats: initialChats,
}: {
  chats: {
    data: { id: string; title: string; is_pinned: boolean }[];
    count: number | null;
  };
}) {
  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["chats"],
    queryFn: ({ pageParam }) =>
      pageParam === 0 ? initialChats : getUserChats(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      const fetchedCount = pages.reduce(
        (acc, { data }) => acc + data.length,
        0
      );

      if (lastPage.count && fetchedCount < lastPage.count) {
        return pages.length;
      }

      return undefined;
    },
    initialData: {
      pageParams: [0],
      pages: [initialChats],
    },
  });

  useEffect(() => {
    const sidebarContent = document.querySelector(
      "#sidebar-content > div"
    ) as HTMLElement;

    if (sidebarContent) {
      sidebarContent.addEventListener("scroll", () => {
        // 300px from the bottom of the sidebar
        const SCROLL_THRESHOLD_PX = 300;

        if (isFetchingNextPage) return;

        const scrollPosition =
          sidebarContent.clientHeight + sidebarContent.scrollTop;
        const totalHeight = sidebarContent.scrollHeight;

        if (scrollPosition >= totalHeight - SCROLL_THRESHOLD_PX) {
          // `cancelRefetch: false` to not fetch again until the first invocation has resolved.
          fetchNextPage({ cancelRefetch: false });
        }
      });

      return () => {
        sidebarContent?.removeEventListener("scroll", () => {});
      };
    }
  }, [isFetchingNextPage]);

  return (
    <SidebarGroup className="grid">
      <SidebarGroupLabel>Chats</SidebarGroupLabel>
      <SidebarMenu>
        {data?.pages?.length ? (
          data?.pages?.map((page) =>
            page?.data?.map((chat) => <ChatItem key={chat.id} chat={chat} />)
          )
        ) : (
          <p className="text-sm text-center text-muted-foreground">No chats</p>
        )}
        {isFetchingNextPage && <ChatListSkeleton />}
      </SidebarMenu>
    </SidebarGroup>
  );
}

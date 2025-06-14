import { Skeleton } from "@/components/ui/skeleton";

export function ChatListSkeleton() {
  return (
    <div className="px-1.5 flex flex-col gap-1.5">
      {new Array(5).fill(0).map((_, index) => (
        <Skeleton key={index} className="h-6 w-full bg-muted-foreground/20" />
      ))}
    </div>
  );
}

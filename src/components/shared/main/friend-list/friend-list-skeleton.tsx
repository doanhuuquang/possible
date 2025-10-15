import AppContainer from "@/components/shared/main/app-container";
import { Skeleton } from "@/components/ui/skeleton";

export default function FriendListSkeleton() {
  return (
    <AppContainer className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <Skeleton
          key={index}
          className="h-auto w-full rounded-lg aspect-square"
        />
      ))}
    </AppContainer>
  );
}

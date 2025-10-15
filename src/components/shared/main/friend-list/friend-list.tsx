"use client";

import AppContainer from "@/components/shared/main/app-container";
import UserCard from "@/components/shared/main/user-card/user-card";
import { useFriendship } from "@/lib/contexts/friend-ship-context";
import FriendListSkeleton from "@/components/shared/main/friend-list/friend-list-skeleton";

export default function FriendList() {
  const { friendShipsLoading, friendsLoading, friends } = useFriendship();

  if (friendShipsLoading || friendsLoading) return <FriendListSkeleton />;

  return (
    <AppContainer className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4">
      {friends.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </AppContainer>
  );
}

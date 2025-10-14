"use client";

import { useUser } from "@/lib/contexts/user-context";
import User from "@/lib/models/user";
import { getUserById } from "@/lib/services/user-service";
import { listenToFriends } from "@/lib/services/friend-ship-service";
import { useEffect, useState } from "react";
import AppContainer from "@/components/shared/main/app-container";
import UserCard from "@/components/shared/main/user-card/user-card";

export default function FriendList() {
  const [friends, setFriends] = useState<User[]>([]);
  const contextUserId = useUser().user?.id || "";

  useEffect(() => {
    if (contextUserId === "") return;

    const unsubscribe = listenToFriends(contextUserId, async (friendships) => {
      const friendIds = friendships.map((f) =>
        f.requesterId === contextUserId ? f.receiverId : f.requesterId
      );

      const fetchedUsers = await Promise.all(
        friendIds.map((id) => getUserById(id))
      );

      setFriends(fetchedUsers.filter((u): u is User => u !== null));
    });

    return () => unsubscribe();
  }, [contextUserId]);

  return (
    <AppContainer className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4">
      {friends.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </AppContainer>
  );
}

"use client";

import { useUser } from "@/lib/contexts/user-context";
import User from "@/lib/models/user";
import { getUserById } from "@/lib/services/user-service";
import { listenToFriends } from "@/lib/services/friend-ship-service";
import { useEffect, useState } from "react";
import AppContainer from "@/components/shared/main/app-container";
import UserCard from "@/components/shared/main/user-card/user-card";
import { FriendShip } from "@/lib/models/friend-ship";

export default function FriendList() {
  const [friends, setFriends] = useState<User[]>([]);
  const userIdContext = useUser().user?.id || "";

  useEffect(() => {
    if (!userIdContext) return;

    const unsubscribe = listenToFriends(userIdContext, async (friendships) => {
      const friendIds = friendships.map((f) =>
        f.requesterId === userIdContext ? f.receiverId : f.requesterId
      );

      const fetchedUsers = await Promise.all(
        friendIds.map((id) => getUserById(id))
      );

      setFriends(fetchedUsers.filter((u): u is User => u !== null));
    });

    return () => unsubscribe();
  }, [userIdContext]);

  return (
    <AppContainer className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4">
      {friends.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
      {friends.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
      {friends.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </AppContainer>
  );
}

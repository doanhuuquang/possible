"use client";

import { useUser } from "@/lib/contexts/user-context";
import { FriendShip } from "@/lib/models/friend-ship";
import User from "@/lib/models/user";
import { listenToFriendShips } from "@/lib/services/friend-ship-service";
import { getUserById } from "@/lib/services/user-service";
import { createContext, useContext, useEffect, useState } from "react";

type FriendShipContextType = {
  friends: User[];
  friendShipsLoading: boolean;
  friendsLoading: boolean;
};

const FriendShipContext = createContext<FriendShipContextType>({
  friends: [],
  friendShipsLoading: false,
  friendsLoading: false,
});

export const FriendShipProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const contextUserId = useUser().user?.id;
  const [friendShips, setFriendShips] = useState<FriendShip[]>([]);
  const [friends, setFriends] = useState<User[]>([]);

  const [friendShipsLoading, setFriendShipsLoading] = useState<boolean>(false);
  const [friendsLoading, setFriendsLoading] = useState<boolean>(false);

  /* 
    Lấy tất cả friendship của user hiện tại
  */
  useEffect(() => {
    if (!contextUserId) return;

    setFriendShipsLoading(true);

    const unsubscribe = listenToFriendShips(contextUserId, (data) => {
      setFriendShips(data);
      setFriendShipsLoading(false);
    });

    return () => unsubscribe();
  }, [contextUserId]);

  /* 
    Lấy tất cả friendship có status = accepted của user hiện tại
  */
  useEffect(() => {
    if (!contextUserId || friendShips.length === 0) return;

    setFriendsLoading(true);

    const fetchFriends = async () => {
      const users = await Promise.all(
        friendShips.map(async (friendShip) => {
          if (friendShip.status !== "accepted") return null;

          const friendId =
            friendShip.requesterId === contextUserId
              ? friendShip.receiverId
              : friendShip.requesterId;

          const user = await getUserById(friendId);
          return user as User;
        })
      );

      setFriends(users.filter((u) => u !== null));
      setFriendsLoading(false);
    };

    fetchFriends();
  }, [friendShips, contextUserId]);

  return (
    <FriendShipContext.Provider
      value={{ friends, friendShipsLoading, friendsLoading }}
    >
      {children}
    </FriendShipContext.Provider>
  );
};

export const useFriendship = () => useContext(FriendShipContext);

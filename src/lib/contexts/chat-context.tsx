"use client";

import { useUser } from "@/lib/contexts/user-context";
import { Message } from "@/lib/models/message";
import { Room } from "@/lib/models/room";
import User from "@/lib/models/user";
import { listenToMessagesInRoom } from "@/lib/services/message-service";
import { listenToRooms } from "@/lib/services/room-service";
import { getUserById } from "@/lib/services/user-service";
import { useContext, createContext, useEffect, useCallback } from "react";

type ChatContextType = {
  rooms: Room[];
  activeRoom: Room | null;
  setActiveRoom: (room: Room | null) => void;
  messagesInActiveRoom: Message[];
  usersInActiveRoom: User[];
  // Loading state
  roomsLoading: boolean;
  usersInActiveRoomLoading: boolean;
};

const ChatContext = createContext<ChatContextType>({
  rooms: [],
  activeRoom: null,
  setActiveRoom: () => {},
  messagesInActiveRoom: [],
  usersInActiveRoom: [],
  // Loading state
  roomsLoading: true,
  usersInActiveRoomLoading: true,
});

import { useState } from "react";

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const contextUserId = useUser().user?.id;

  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [messagesInActiveRoom, setMessagesInActiveRoom] = useState<Message[]>(
    []
  );
  const [usersInActiveRoom, setUsersInActiveRoom] = useState<User[]>([]);

  const [roomsLoading, setRoomsLoading] = useState<boolean>(false);
  const [usersInActiveRoomLoading, setUsersInActiveRoomLoading] =
    useState<boolean>(false);

  /* 
    Lấy tất cả phòng chat của user hiện tại
  */
  useEffect(() => {
    if (!contextUserId) return;

    setRoomsLoading(true);

    const unsubscribe = listenToRooms(contextUserId, (newRooms) => {
      setRooms((prevRooms) => {
        // Nếu chưa có rooms thì set luôn
        if (prevRooms.length === 0) return newRooms;

        const updatedRooms = [...prevRooms];

        newRooms.forEach((newRoom) => {
          const i = updatedRooms.findIndex((r) => r.id === newRoom.id);
          if (i > -1) {
            // chỉ cập nhật room thay đổi
            updatedRooms[i] = { ...updatedRooms[i], ...newRoom };
          } else {
            updatedRooms.push(newRoom);
          }
        });

        return updatedRooms;
      });

      setRoomsLoading(false);
    });

    return () => unsubscribe();
  }, [contextUserId]);

  /*
    Lấy tất cả tin nhắn trong phòng chat được chọn hiện tại
  */
  useEffect(() => {
    if (!activeRoom || contextUserId === "") return;

    setMessagesInActiveRoom([]);

    const unsubscribe = listenToMessagesInRoom(activeRoom.id, (data) =>
      setMessagesInActiveRoom(data)
    );

    return () => unsubscribe();
  }, [contextUserId, activeRoom]);

  /*
    Lấy tất cả người dùng trong phòng chat được chọn hiện tại
  */
  useEffect(() => {
    const fetchParticipants = async () => {
      if (!activeRoom || contextUserId === "") return;

      setUsersInActiveRoomLoading(true);
      setUsersInActiveRoom([]);

      const users = await Promise.all(
        activeRoom.participants.map(async (participantId: string) => {
          const user = await getUserById(participantId);
          return user;
        })
      );

      setUsersInActiveRoom(users.filter((user): user is User => user !== null));
      setUsersInActiveRoomLoading(false);
    };

    fetchParticipants();
  }, [contextUserId, activeRoom]);

  return (
    <ChatContext.Provider
      value={{
        rooms,
        activeRoom,
        setActiveRoom,
        messagesInActiveRoom,
        usersInActiveRoom,
        // Loading state
        roomsLoading,
        usersInActiveRoomLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);

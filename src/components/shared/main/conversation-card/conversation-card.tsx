"use client";

import { cn } from "@/lib/utils";

import { Room } from "@/lib/models/room";
import React, { useEffect } from "react";
import { Message } from "@/lib/models/message";
import {
  getMessageById,
  listenToLatestMessageInRoom,
} from "@/lib/services/message-service";
import User from "@/lib/models/user";
import { getUserById } from "@/lib/services/user-service";
import { useUser } from "@/lib/contexts/user-context";
import RoomAvatar from "@/components/shared/main/chat-box/room-avatar";
import RoomName from "@/components/shared/main/chat-box/room-name";
import { Skeleton } from "@/components/ui/skeleton";
import { useChat } from "@/lib/contexts/chat-context";

export default function ConversationCard({
  room,
  className,
}: {
  room: Room;
  className?: string;
}) {
  const { setActiveRoom, activeRoom } = useChat();
  const [lastestMessage, setLastestMessage] = React.useState<Message | null>(
    null
  );
  const [participants, setParticipants] = React.useState<User[]>([]);
  const [isLoadingRoomInfor, setIsLoadingRoomInfor] = React.useState(false);
  const contextUserId = useUser().user?.id;

  // Lấy tin nhắn mới nhất trong phòng
  useEffect(() => {
    const unsubscribe = listenToLatestMessageInRoom(room.id, (data) => {
      setLastestMessage(data);
    });

    return () => unsubscribe();
  }, [room.id]);

  // Lấy thông tin những người tham gia trong phòng
  useEffect(() => {
    const fetchParticipants = async () => {
      if (!room) return;

      setIsLoadingRoomInfor(true);
      setParticipants([]);

      const users = await Promise.all(
        room.participants.map(async (participantId: string) => {
          const user = await getUserById(participantId);
          return user;
        })
      );

      setParticipants(users.filter((user): user is User => user !== null));
      setIsLoadingRoomInfor(false);
    };

    fetchParticipants();
  }, [room.id]);

  return (
    <div
      onClick={() => setActiveRoom(room)}
      className={cn(
        "p-4 hover:bg-accent/50 cursor-pointer flex items-center gap-4 transition-colors duration-300",
        activeRoom?.id === room.id && "bg-muted/50",
        className
      )}
    >
      <RoomAvatar
        contextUserId={contextUserId || ""}
        participants={participants}
        room={room}
        isLoading={isLoadingRoomInfor}
      />
      <div
        className={cn(
          "w-1/2 flex flex-col justify-between",
          isLoadingRoomInfor && "gap-1"
        )}
      >
        <RoomName
          contextUserId={contextUserId || ""}
          participants={participants}
          room={room}
          isLoading={isLoadingRoomInfor}
        />
        {isLoadingRoomInfor ? (
          <Skeleton className="h-3 w-1/2 rounded-none" />
        ) : (
          <p className="font-medium text-sm truncate text-foreground/70">
            {lastestMessage?.content || "Chưa gửi tin nhắn nào"}
          </p>
        )}
      </div>
      <div className="grow flex flex-col gap-2 justify-between text-end text-xs text-foreground/50">
        <p>{lastestMessage?.status}</p>
        <p>{lastestMessage?.getFormattedTime()}</p>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Room } from "@/lib/models/room";
import React, { useEffect } from "react";
import { Message } from "@/lib/models/message";
import { getMessageById } from "@/lib/services/message-service";

export default function ConversationCard({
  room,
  className,
}: {
  room: Room;
  className?: string;
}) {
  const [lastestMessage, setLastestMessage] = React.useState<Message | null>(
    null
  );

  useEffect(() => {
    const fetchMessage = async () => {
      if (!room.lastestMessageId) return;
      else setLastestMessage(await getMessageById(room.lastestMessageId));
    };
    fetchMessage();
  }, [room.lastestMessageId]);

  return (
    <Link
      href={`/talks/${room.id}`}
      className={cn(
        "p-4 hover:bg-accent/50 cursor-pointer flex gap-4 transition-colors duration-300",
        className
      )}
    >
      <Avatar className="w-12 h-12">
        <AvatarImage src={room.roomAvatar} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="w-1/2 flex flex-col gap-2 justify-between">
        <p className="font-semibold truncate ">{room.roomName}</p>
        <p className="font-medium text-sm truncate text-foreground/70">
          {lastestMessage?.content || "Chưa gửi tin nhắn nào"}
        </p>
      </div>
      <div className="grow flex flex-col gap-2 justify-between text-end text-xs text-foreground/50">
        <p>{lastestMessage?.status}</p>
        <p>{lastestMessage?.getFormattedTime()}</p>
      </div>
    </Link>
  );
}

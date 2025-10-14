"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Message } from "@/lib/models/message";
import { sentMessage } from "@/lib/services/message-service";
import { ChevronLeft, Ellipsis, Paperclip, Send } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useUser } from "@/lib/contexts/user-context";
import { useIsMobile } from "@/hooks/use-mobile";
import RoomAvatar from "@/components/shared/main/chat-box/room-avatar";
import RoomName from "@/components/shared/main/chat-box/room-name";
import { updateLatestMessageInRoom } from "@/lib/services/room-service";
import { Skeleton } from "@/components/ui/skeleton";
import { useChat } from "@/lib/contexts/chat-context";

const ChatBoxHeader = () => {
  const {
    setActiveRoom,
    activeRoom,
    usersInActiveRoomLoading,
    usersInActiveRoom,
  } = useChat();
  const contextUserId = useUser().user?.id || "";
  const isMobile = useIsMobile();

  if (!activeRoom) return;

  return (
    <div className="flex gap-4 items-center justify-between p-4 border-b">
      {/* Nút quay lại */}
      {isMobile && (
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() => setActiveRoom(null)}
        >
          <ChevronLeft />
        </Button>
      )}
      {/* 
          - Ảnh đại diện và tên
          - Nếu như trong cuộc trò chuyện chỉ có 2 người thì hiển thị tên và ảnh đại diện người còn lại
          - Nếu trong cuộc trò chuyện có nhiều người thì hiển thị tên cuộc trò chuyện hoặc là tên những người tham gia, ảnh đại diện mặc định cho nhóm
        */}
      <div className="flex gap-4 w-full items-center">
        <RoomAvatar
          contextUserId={contextUserId || ""}
          participants={usersInActiveRoom}
          room={activeRoom}
          isLoading={usersInActiveRoomLoading}
        />
        <div className="w-full max-w-2/3 space-y-1">
          <RoomName
            contextUserId={contextUserId || ""}
            participants={usersInActiveRoom}
            room={activeRoom}
            isLoading={usersInActiveRoomLoading}
          />
          {usersInActiveRoomLoading ? (
            <Skeleton className="h-4 w-1/2 rounded-none" />
          ) : (
            <p className="text-xs">Đang hoạt động</p>
          )}
        </div>
      </div>
      {/* Nút báo cáo */}
      <Button variant="outline" size="icon" className="rounded-full">
        <Ellipsis />
      </Button>
    </div>
  );
};

const MessageItem = ({ message }: { message: Message }) => {
  const { usersInActiveRoom } = useChat();
  const contextUserId = useUser().user?.id || "";

  const getUserLastAndFirstName = (): {
    lastName: string;
    firstName: string;
  } => {
    const sender = usersInActiveRoom.find((u) => u.id === message.senderId);
    return {
      lastName: sender?.lastName || "",
      firstName: sender?.firstName || "",
    };
  };

  return (
    <div
      className={cn(
        "w-full flex items-end gap-2",
        message.senderId === contextUserId
          ? "self-end flex-row-reverse" // Tin nhắn của người dùng hiện tại
          : "self-start" // Tin nhắn của người khác
      )}
    >
      {/* Ảnh đại diện người gửi */}
      {contextUserId !== message.senderId && (
        <Avatar>
          <AvatarImage src=" " />
          <AvatarFallback>
            {getUserLastAndFirstName().firstName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
      <div className="w-fit max-w-1/2">
        {/* Tên người gửi */}
        {contextUserId !== message.senderId && (
          <p className="mb-2 text-xs text-muted-foreground">
            {getUserLastAndFirstName().lastName +
              " " +
              getUserLastAndFirstName().firstName}
          </p>
        )}

        <div
          className={cn(
            " p-3 rounded-md break-words whitespace-pre-wrap",
            message.senderId === contextUserId
              ? "bg-primary text-primary-foreground" // Tin nhắn của người dùng hiện tại
              : "bg-muted" // Tin nhắn của người khác
          )}
        >
          {/* Nội dung tin nhắn */}
          {message.content}

          {/* Thời gian gửi */}
          <p
            className={cn(
              "mt-2 t text-xs",
              message.senderId === contextUserId
                ? "text-primary-foreground/50"
                : "text-muted-foreground"
            )}
          >
            {message.getFormattedTime()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function ChatBox() {
  const { activeRoom, messagesInActiveRoom } = useChat();

  const [newMessage, setNewMessage] = React.useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const contextUserId = useUser().user?.id;

  // Tự động cuộn xuống tin nhắn mới nhất khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  }, [messagesInActiveRoom]);

  if (!activeRoom) return;

  return (
    <div className="h-full w-full flex flex-col">
      <ChatBoxHeader />
      <div className="flex flex-col gap-4 h-full grow p-4 overflow-y-scroll hide-scrollbar">
        {/* Danh sách tin nhắn */}
        {messagesInActiveRoom.map((message, index) => (
          <div ref={messagesEndRef} key={index}>
            <MessageItem message={message} />
          </div>
        ))}
      </div>

      {/* Thanh công cụ nhập tin nhắn */}
      <div className="w-full">
        <div className="w-full mx-auto flex items-center justify-center p-4 sticky bottom-0 z-1 gap-4 bg-muted/20">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size={"icon"}
                variant="ghost"
                onClick={async () => {
                  await sentMessage({
                    senderId: contextUserId || "",
                    roomId: activeRoom.id,
                    messageType: "text",
                    content: newMessage,
                  });
                }}
              >
                <Paperclip />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Đính kèm tệp</p>
            </TooltipContent>
          </Tooltip>

          <Input
            value={newMessage}
            placeholder="Nhắn tin"
            onChange={(value) => setNewMessage(value.target.value)}
            className=" w-full bg-muted/50 rounded-full"
          />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                disabled={!(newMessage !== "")}
                onClick={async () => {
                  const messageId = await sentMessage({
                    senderId: contextUserId || "",
                    roomId: activeRoom.id,
                    messageType: "text",
                    content: newMessage.trim(),
                  });

                  await updateLatestMessageInRoom(messageId, activeRoom.id);

                  setNewMessage("");
                }}
              >
                <Send />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Gửi đi tin nhắn</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

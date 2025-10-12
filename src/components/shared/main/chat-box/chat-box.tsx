"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

import AppBackButton from "@/components/shared/main/app-back-button";
import AppContainer from "@/components/shared/main/app-container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Message } from "@/lib/models/message";
import { Room } from "@/lib/models/room";
import {
  listenToMessagesInRoom,
  sentMessage,
} from "@/lib/services/message-service";
import { getRoomById } from "@/lib/services/room-service";
import { Ellipsis, Paperclip, Send } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useUser } from "@/lib/contexts/user-context";
import User from "@/lib/models/user";
import { getUserById } from "@/lib/services/user-service";

export default function ChatBox({ roomId }: { roomId: string }) {
  const [room, setRoom] = React.useState<Room | null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [newMessage, setNewMessage] = React.useState("");
  const [participants, setParticipants] = React.useState<User[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const contextUserId = useUser().user?.id;

  useEffect(() => {
    const fetchRoom = async () => {
      if (!roomId) return;
      else setRoom(await getRoomById(roomId));
    };

    fetchRoom();
  }, [roomId]);

  useEffect(() => {
    const unsubscribe = listenToMessagesInRoom(roomId, (data) => {
      setMessages(data);
    });

    return () => unsubscribe();
  }, [roomId]);

  useEffect(() => {
    const fetchParticipants = async () => {
      if (!room) return;
      setParticipants([]);

      room?.participants.map(async (participantId: string) => {
        const user: User | null = await getUserById(participantId);

        if (user) setParticipants((prev) => [...prev, user]);
      });
    };

    fetchParticipants();
  }, [room]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex gap-4 items-center justify-between p-4 border-b">
        {/* Nút quay lại */}
        <AppBackButton url="/talks" />

        {/* Ảnh đại diện và tên */}
        <div className="flex gap-4 w-full items-center">
          <Avatar className="w-10 h-10">
            <AvatarImage src={room?.roomAvatar} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="w-full max-w-2/3">
            <p className="font-bold text-lg truncate">{room?.roomName}</p>
            <p className="text-xs">Đang hoạt động</p>
          </div>
        </div>
        {/* Nút báo cáo */}
        <Button variant="outline" size="icon" className="rounded-full">
          <Ellipsis />
        </Button>
      </div>

      <AppContainer className="flex flex-col gap-4 h-full grow ">
        {/* Tin nhắn */}
        {messages.map((message, index) => (
          <div
            ref={index === messages.length - 1 ? messagesEndRef : null}
            key={index}
            className={cn(
              "w-full flex items-end gap-2",
              message.senderId === contextUserId
                ? "self-end flex-row-reverse"
                : "self-start"
            )}
          >
            <div
              className={cn(
                "w-fit max-w-1/2 p-3 rounded-md break-words whitespace-pre-wrap",
                message.senderId === contextUserId
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted "
              )}
            >
              {/* Tên người gửi */}
              <p className="mb-2">
                {message.senderId === contextUserId
                  ? "Bạn"
                  : (() => {
                      const sender = participants.find(
                        (p) => p.id === message.senderId
                      );
                      return sender
                        ? `${sender.lastName} ${sender.firstName}`
                        : "Người dùng đã xóa";
                    })()}
              </p>

              {/* Nội dung tin nhắn */}
              {message.content}

              {/* Thời gian gửi */}
              <p
                className={cn(
                  "mt-2 text-xs",
                  message.senderId === contextUserId
                    ? "text-primary-foreground/50"
                    : "text-muted-foreground"
                )}
              >
                {message.getFormattedTime()}
              </p>
            </div>
          </div>
        ))}
      </AppContainer>

      {/* Thanh công cụ nhập tin nhắn */}
      <div className="w-full">
        <div className="w-full mx-auto flex items-center justify-center p-4 sticky bottom-0 z-1 gap-4 border-t">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size={"icon"}
                variant="ghost"
                onClick={async () => {
                  await sentMessage({
                    senderId: contextUserId || "",
                    roomId: roomId,
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
                  await sentMessage({
                    senderId: contextUserId || "",
                    roomId: roomId,
                    messageType: "text",
                    content: newMessage.trim(),
                  });

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

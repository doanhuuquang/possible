"use client";

import AppContainer from "@/components/shared/main/app-container";
import AppHeader from "@/components/shared/main/app-header";
import ChatBox from "@/components/shared/main/chat-box/chat-box";
import ConversationCard from "@/components/shared/main/conversation-card/conversation-card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { useChat } from "@/lib/contexts/chat-context";
import { cn } from "@/lib/utils";
import { LoaderCircle, Plus } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFriendship } from "@/lib/contexts/friend-ship-context";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import User from "@/lib/models/user";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useUser } from "@/lib/contexts/user-context";
import { Input } from "@/components/ui/input";
import { createRoom } from "@/lib/services/room-service";
import { toast } from "sonner";

const CreateNewChatDialog = () => {
  const contextUserId = useUser().user?.id;
  const { friendShipsLoading, friendsLoading, friends } = useFriendship();
  const [selectedFriends, setSelectedFriends] = useState<User[]>([]);
  const [roomName, setRoomName] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full">
              <Plus />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Tạo cuộc trò chuyện mới</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="space-y-3">
          <DialogTitle>Tạo cuộc trò chuyện mới</DialogTitle>
          <Input
            onChange={(value) => setRoomName(value.target.value)}
            type="text"
            placeholder="Tên cuộc trò chuyện (Không bắt buộc)"
          />
          <DialogDescription>
            Mời một người dùng vào đoạn chat này. Hành động này sẽ tạo một cuộc
            trò chuyện nhóm mới.
          </DialogDescription>
        </DialogHeader>

        <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
          {selectedFriends &&
            selectedFriends.map((friend, index) => (
              <Avatar key={index}>
                <AvatarImage src={friend.avatarBase64} alt="@shadcn" />
                <AvatarFallback>{friend.firstName.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
        </div>

        <Separator />

        {friendShipsLoading || friendsLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-[250px]" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2 max-h-[200px] overflow-y-scroll hide-scrollbar">
            {friends.length === 0 ? (
              <p>Chưa có bạn bè nào</p>
            ) : (
              friends.map((friend, index) => (
                <div key={index} className="w-full flex items-center gap-3">
                  <Checkbox
                    defaultChecked={selectedFriends.some(
                      (f) => f.id === friend.id
                    )}
                    onCheckedChange={(value) => {
                      if (value) {
                        setSelectedFriends([...selectedFriends, friend]);
                      } else {
                        setSelectedFriends(
                          selectedFriends.filter((f) => f.id !== friend.id)
                        );
                      }
                    }}
                  />

                  <div className="flex items-center gap-3 grow">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={friend.avatarBase64} />
                      <AvatarFallback>
                        {friend.firstName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <p className="max-w-[200px] truncate">
                      {friend.lastName} {friend.firstName}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <Separator />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Hủy</Button>
          </DialogClose>
          <Button
            disabled={selectedFriends.length === 0 || isCreating}
            type="submit"
            onClick={async () => {
              if (!contextUserId) return;

              try {
                setIsCreating(true);

                const participants: string[] = [
                  contextUserId,
                  ...selectedFriends.map((f) => f.id),
                ];

                await createRoom({
                  participants: participants,
                  roomName: roomName || "",
                  roomAvatar: "",
                  createrId: contextUserId,
                });

                toast("Thành công", {
                  description: "Đã tạo cuộc trò chuyện mới",
                  action: {
                    label: "Oke",
                    onClick: () => null,
                  },
                });
              } catch (error) {
                toast("Thất bại", {
                  description: "Cố lỗi xảy ra, vui lòng thử lại sau!",
                  action: {
                    label: "Oke",
                    onClick: () => null,
                  },
                });
              } finally {
                setIsCreating(false);
              }
            }}
          >
            {isCreating ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              "Tạo cuộc trò chuyện"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function TalksPage() {
  const { rooms, activeRoom } = useChat();
  const isMobile = useIsMobile();

  return (
    <div className="h-screen flex flex-col">
      <AppHeader title="Trò chuyện">
        <div className="w-full flex items-center justify-between">
          <div></div>
          <CreateNewChatDialog />
        </div>
      </AppHeader>

      <div
        className={cn(
          "grow grid divide-x w-full overflow-hidden",
          isMobile ? "grid-cols-1" : "grid-cols-2"
        )}
      >
        {/* Danh sách cuộc trò chuyện */}
        <AppContainer className="flex w-full h-full flex-col divide-y p-0">
          {rooms.length > 0 ? (
            rooms.map((room, index) => (
              <ConversationCard key={index} room={room} />
            ))
          ) : (
            <p className="p-4 font-lg text-muted-foreground">
              Chưa có cuộc trò chuyện nào
            </p>
          )}
        </AppContainer>

        {/* Hộp thoại chat */}
        <AppContainer
          className={cn(
            "p-0 z-10 bg-background overflow-hidden",
            isMobile ? "h-screen fixed top-0 left-0" : "h-[calc(100vh-64px)]",
            isMobile
              ? activeRoom
                ? "translate-x-0 transition-all duration-300"
                : "translate-x-full transition-all duration-300"
              : null
          )}
        >
          {activeRoom ? (
            <ChatBox />
          ) : (
            <p className="p-4 font-lg text-muted-foreground">
              Chọn một cuộc trò chuyện để bắt đầu.
            </p>
          )}
        </AppContainer>
      </div>
    </div>
  );
}

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
import { Plus } from "lucide-react";

export default function TalksPage() {
  const { rooms, activeRoom } = useChat();
  const isMobile = useIsMobile();

  return (
    <div className="h-screen flex flex-col">
      <AppHeader title="Trò chuyện">
        <div className="w-full flex items-center justify-between">
          <div></div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => {}}
              >
                <Plus />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Tạo cuộc trò chuyện mới</p>
            </TooltipContent>
          </Tooltip>
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
          {rooms.map((room, index) => (
            <ConversationCard key={index} room={room} />
          ))}
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

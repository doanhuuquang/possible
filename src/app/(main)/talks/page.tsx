"use client";

import AppContainer from "@/components/shared/main/app-container";
import AppHeader from "@/components/shared/main/app-header";
import ConversationCard from "@/components/shared/main/conversation-card/conversation-card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUser } from "@/lib/contexts/user-context";
import { Room } from "@/lib/models/room";
import { listenToRooms } from "@/lib/services/room-service";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

export default function TalksPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const userIdContext = useUser().user?.id || "";

  useEffect(() => {
    const unsubscribe = listenToRooms(userIdContext, (data) => {
      setRooms(data);
    });

    return () => unsubscribe();
  }, [userIdContext]);

  return (
    <div>
      <AppHeader>
        <div className="w-full flex items-center justify-between">
          <p className="font-bold text-2xl">Trò chuyện</p>
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
      <AppContainer className="p-0 grid grid-cols-1 divide-y">
        {rooms.map((room, index) => (
          <ConversationCard key={index} room={room} />
        ))}
      </AppContainer>
    </div>
  );
}

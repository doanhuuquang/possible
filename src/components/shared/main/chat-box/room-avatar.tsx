import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Room } from "@/lib/models/room";
import User from "@/lib/models/user";
import { Users } from "lucide-react";

export default function RoomAvatar({
  room,
  participants,
  contextUserId,
  isLoading,
}: {
  room: Room;
  participants: User[];
  contextUserId: string;
  isLoading: boolean;
}) {
  if (isLoading) return <Skeleton className="h-10 w-10 rounded-full" />;

  return (
    <Avatar className="w-10 h-10">
      <AvatarImage
        src={
          room.roomType == "private"
            ? participants.find((p) => p.id !== contextUserId)?.avatarBase64
            : ""
        }
      />
      <AvatarFallback>
        {room.roomType == "private"
          ? participants
              .find((p) => p.id !== contextUserId)
              ?.firstName.charAt(0)
          : "CN"}
      </AvatarFallback>
    </Avatar>
  );
}

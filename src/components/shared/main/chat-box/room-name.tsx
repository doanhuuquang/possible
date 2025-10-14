import { Skeleton } from "@/components/ui/skeleton";
import { Room } from "@/lib/models/room";
import User from "@/lib/models/user";

export default function RoomName({
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
  if (isLoading) return <Skeleton className="h-7 w-full rounded-none" />;

  return (
    <p className="font-bold text-lg truncate">
      {room.roomType == "private" && room.roomName == ""
        ? (() => {
            const otherParticipant = participants.find(
              (p) => p.id !== contextUserId
            );

            if (!otherParticipant) return "Người dùng đã xóa";

            return (
              otherParticipant?.lastName + " " + otherParticipant?.firstName
            );
          })()
        : room.roomName !== ""
        ? room.roomName
        : (() => {
            return participants.map((p) => p.firstName).join(", ");
          })()}
    </p>
  );
}

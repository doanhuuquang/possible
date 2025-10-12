import { Button } from "@/components/ui/button";
import User from "@/lib/models/user";
import { Ellipsis, UserRoundCheck } from "lucide-react";
import Image from "next/image";

export default function UserCard({
  user,
  isPending = false,
}: {
  user: User;
  isPending?: boolean;
}) {
  return (
    <div className="w-full cursor-pointer rounded-md relative border">
      <Image
        src={
          user.avatarBase64 === "" || user.avatarBase64 === null
            ? "/assets/user-default-avatars/avatar-1.png"
            : user.avatarBase64
        }
        alt={user.id}
        width={100}
        height={100}
        className="aspect-square w-full object-cover rounded-md"
      ></Image>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="relative w-full h-full">
          <p className="w-full p-3 bg-black/20 truncate mt-2 absolute bottom-0 font-semibold text-white">{`${user.lastName} ${user.firstName}`}</p>
          <Button
            variant={"default"}
            size={"icon"}
            className="absolute top-3 right-3 bg-black/20 rounded-full text-white hover:bg-black/30"
          >
            {isPending ? <UserRoundCheck /> : <Ellipsis />}
          </Button>
        </div>
      </div>
    </div>
  );
}

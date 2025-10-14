import AppHeader from "@/components/shared/main/app-header";
import FriendList from "@/components/shared/main/friend-list/friend-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function FriendsPage() {
  return (
    <div>
      <AppHeader title="Bạn bè">
        <div className="w-full flex items-center justify-between">
          <div></div>
          <Input
            placeholder="Tìm kiếm bạn bè"
            className="w-full max-w-lg p-5"
          />
        </div>
      </AppHeader>
      <FriendList />
    </div>
  );
}

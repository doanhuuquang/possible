import AppHeader from "@/components/shared/main/app-header";
import FriendList from "@/components/shared/main/friend-list/friend-list";

export default function FriendsPage() {
  return (
    <div>
      <AppHeader>
        <div className="w-full flex items-center justify-between">
          <p className="font-bold text-2xl">Bạn bè</p>
        </div>
      </AppHeader>
      <FriendList />
    </div>
  );
}

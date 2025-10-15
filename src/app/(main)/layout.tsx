import { AppSidebar } from "@/components/shared/main/sidebar/app-sidebar";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ChatProvider } from "@/lib/contexts/chat-context";
import { FriendShipProvider } from "@/lib/contexts/friend-ship-context";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <FriendShipProvider>
        <ChatProvider>
          <AppSidebar />
          <SidebarInset>
            <div className="w-full bg-background">{children}</div>
          </SidebarInset>
        </ChatProvider>
      </FriendShipProvider>
    </SidebarProvider>
  );
}

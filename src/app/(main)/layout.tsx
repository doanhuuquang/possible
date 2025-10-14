import { AppSidebar } from "@/components/shared/main/sidebar/app-sidebar";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ChatProvider } from "@/lib/contexts/chat-context";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <ChatProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="w-full bg-background">{children}</div>
        </SidebarInset>
      </ChatProvider>
    </SidebarProvider>
  );
}

import { AppSidebar } from "@/components/shared/main/sidebar/app-sidebar";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="w-full bg-background">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

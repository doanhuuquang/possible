import { SidebarTrigger } from "@/components/ui/sidebar";

export default function AppHeader({
  title,
  children,
}: {
  title?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="flex h-16 w-full shrink-0 items-center gap-2 transition-[width,height] ease-linear sticky top-0 border-b-1 bg-background/20 backdrop-blur-2xl z-10">
      <div className="w-full flex items-center justify-between gap-5 px-4">
        <SidebarTrigger className="-ml-1" />
        <p className="font-bold text-2xl">{title}</p>
        <div className="grow">{children}</div>
      </div>
    </header>
  );
}

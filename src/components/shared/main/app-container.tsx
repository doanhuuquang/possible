import { cn } from "@/lib/utils";

export default function AppContainer({
  children,
  className,
}: Readonly<{ children: React.ReactNode; className?: string }>) {
  return (
    <div
      className={cn(
        "w-full max-w-7xl h-full mx-auto p-4 overflow-scroll hide-scrollbar",
        className
      )}
    >
      {children}
    </div>
  );
}

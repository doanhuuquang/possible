import AppHeader from "@/components/shared/main/app-header";
import { useChat } from "@/lib/contexts/chat-context";
import { LoaderCircle } from "lucide-react";

export default function Home() {
  return (
    <div>
      <AppHeader title="Trang chủ"></AppHeader>
    </div>
  );
}

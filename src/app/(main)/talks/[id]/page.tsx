import ChatBox from "@/components/shared/main/chat-box/chat-box";
import React from "react";

export default async function ChatScreen({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  return (
    <div className="h-screen">
      <ChatBox roomId={id} />
    </div>
  );
}

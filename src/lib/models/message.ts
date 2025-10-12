import { format, formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

export class Message {
  id: string;
  senderId: string;
  roomId: string;
  messageType: "text" | "image";
  content: string;
  status: "sent" | "delivered" | "read";
  createdAt: Date;

  constructor(data: {
    id: string;
    senderId: string;
    roomId: string;
    messageType: "text" | "image";
    content: string;
    status: "sent" | "delivered" | "read";
    createdAt: Date;
  }) {
    this.id = data.id;
    this.senderId = data.senderId;
    this.roomId = data.roomId;
    this.messageType = data.messageType;
    this.content = data.content;
    this.status = data.status;
    this.createdAt = data.createdAt;
  }

  getFormattedTime(): string {
    if (!this.createdAt) return "";

    const date = this.createdAt;

    return Date.now() - date.getTime() < 1000 * 60 * 60 * 24
      ? format(date, "HH:mm", { locale: vi }) // 2 tiếng trước
      : formatDistanceToNow(date, { locale: vi, addSuffix: true }); // 2 ngày trước
  }
}

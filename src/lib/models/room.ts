export class Room {
  id: string;
  participants: string[];
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  roomName: string;
  roomAvatar: string;
  roomType: "private" | "group";
  latestMessageId?: string;

  constructor(data: {
    id: string;
    participants: string[];
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
    roomName: string;
    roomAvatar: string;
    roomType: "private" | "group";
    latestMessageId?: string;
  }) {
    this.id = data.id;
    this.participants = data.participants;
    this.createdAt = data.createdAt;
    this.createdBy = data.createdBy;
    this.updatedAt = data.updatedAt;
    this.updatedBy = data.updatedBy;
    this.roomName = data.roomName;
    this.roomAvatar = data.roomAvatar;
    this.roomType = data.roomType;
    this.latestMessageId = data.latestMessageId;
  }
}

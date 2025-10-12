export type FriendStatus = "pending" | "accepted" | "rejected";

export class FriendShip {
  id: string;
  requesterId: string;
  receiverId: string;
  participants: string[];
  status: FriendStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: {
    id: string;
    requesterId: string;
    receiverId: string;
    participants: string[];
    status: FriendStatus;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = data.id;
    this.requesterId = data.requesterId;
    this.receiverId = data.receiverId;
    this.participants = data.participants;
    this.status = data.status;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}

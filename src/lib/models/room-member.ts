export class RoomMember {
  memberId: string;
  roomId: string;
  joinedAt: Date;
  role: "admin" | "member";

  constructor(data: {
    memberId: string;
    roomId: string;
    joinedAt: Date;
    role: "admin" | "member";
  }) {
    this.memberId = data.memberId;
    this.roomId = data.roomId;
    this.joinedAt = data.joinedAt;
    this.role = data.role;
  }
}

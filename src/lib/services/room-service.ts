import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  onSnapshot,
  where,
  getDoc,
  doc,
} from "firebase/firestore";
import firestore from "@/lib/firebase/firebase-firestore-database";
import { Room } from "@/lib/models/room";

const createRoom = async ({
  participants,
  roomName,
  roomAvatar,
  createrId,
}: {
  participants: string[];
  roomName?: string;
  roomAvatar?: string;
  createrId: string;
}) => {
  const roomRef = collection(firestore, "rooms");

  const docRef = await addDoc(roomRef, {
    participants,
    createdAt: serverTimestamp(),
    createdBy: createrId,
    updatedAt: serverTimestamp(),
    updatedBy: null,
    roomName: roomName || "",
    roomAvatar: roomAvatar || "",
    roomType: participants.length > 2 ? "group" : "private",
    lastestMessage: null,
  });
  return docRef.id;
};

const listenToRooms = (userId: string, callback: (rooms: Room[]) => void) => {
  const roomsRef = collection(firestore, "rooms");
  const q = query(roomsRef, where("participants", "array-contains", userId));

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(
      (docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Room)
    );
    callback(data);
  });
};

const getRoomById = async (roomId: string): Promise<Room | null> => {
  const roomsRef = collection(firestore, "rooms");
  const docSnap = await getDoc(doc(roomsRef, roomId));

  if (!docSnap.exists()) return null;

  const data = docSnap.data();
  return new Room({
    id: docSnap.id,
    participants: data.participants,
    createdBy: data.createdBy,
    updatedBy: data.updatedBy,
    roomName: data.roomName,
    roomAvatar: data.roomAvatar,
    roomType: data.roomType,
    latestMessageId: data.latestMessageId,
    createdAt:
      typeof data.createdAt?.toDate === "function"
        ? data.createdAt.toDate()
        : new Date(data.createdAt),
    updatedAt:
      typeof data.updatedAt?.toDate === "function"
        ? data.updatedAt.toDate()
        : new Date(data.updatedAt),
  });
};

export { createRoom, listenToRooms, getRoomById };

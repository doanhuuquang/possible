import { Message } from "@/lib/models/message";

import {
  collection,
  query,
  onSnapshot,
  where,
  getDoc,
  doc,
  addDoc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import firestore from "@/lib/firebase/firebase-firestore-database";

const listenToMessagesInRoom = (
  roomId: string,
  callback: (messages: Message[]) => void
) => {
  const messagesRef = collection(firestore, "messages");
  const q = query(
    messagesRef,
    where("roomId", "==", roomId),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    const data: Message[] = snapshot.docs.map((docSnap) => {
      const childData = docSnap.data();

      return new Message({
        id: docSnap.id,
        senderId: childData.senderId,
        roomId: childData.roomId,
        messageType: childData.messageType,
        content: childData.content,
        status: childData.status,
        createdAt:
          typeof childData.createdAt?.toDate === "function"
            ? childData.createdAt.toDate()
            : new Date(childData.createdAt),
      });
    });

    callback(data);
  });
};

const getMessageById = async (messageId: string): Promise<Message | null> => {
  const messageRef = collection(firestore, "messages");
  const docSnap = await getDoc(doc(messageRef, messageId));

  if (!docSnap.exists()) return null;

  const data = docSnap.data();

  return new Message({
    id: docSnap.id,
    senderId: data.senderId,
    roomId: data.roomId,
    messageType: data.messageType,
    content: data.content,
    status: data.status,
    createdAt:
      typeof data.createdAt?.toDate === "function"
        ? data.createdAt.toDate()
        : new Date(data.createdAt),
  });
};

const sentMessage = async ({
  senderId,
  roomId,
  messageType,
  content,
}: {
  senderId: string;
  roomId: string;
  messageType: "text" | "image";
  content: string;
}) => {
  try {
    const messageRef = collection(firestore, "messages");
    await addDoc(messageRef, {
      senderId,
      roomId,
      messageType,
      content,
      status: "sent",
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    return error;
  }
};

export { listenToMessagesInRoom, getMessageById, sentMessage };

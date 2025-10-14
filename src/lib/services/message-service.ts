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
  limit,
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

export const listenToLatestMessageInRoom = (
  roomId: string,
  callback: (message: Message | null) => void
) => {
  const messagesRef = collection(firestore, "messages");
  const q = query(
    messagesRef,
    where("roomId", "==", roomId),
    orderBy("createdAt", "desc"),
    limit(1)
  );

  return onSnapshot(q, (snapshot) => {
    if (snapshot.empty) {
      callback(null);
      return;
    }

    const docSnap = snapshot.docs[0];
    const childData = docSnap.data();

    const message = new Message({
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

    callback(message);
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
}): Promise<string> => {
  try {
    const messageRef = collection(firestore, "messages");
    const docRef = await addDoc(messageRef, {
      senderId,
      roomId,
      messageType,
      content,
      status: "sent",
      createdAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    return "";
  }
};

export { listenToMessagesInRoom, getMessageById, sentMessage };

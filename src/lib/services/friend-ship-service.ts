import firestore from "@/lib/firebase/firebase-firestore-database";
import { FriendShip } from "@/lib/models/friend-ship";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

const sendFriendRequest = async (requesterId: string, receiverId: string) => {
  if (requesterId === receiverId)
    throw new Error("Không thể tự gửi lời mời cho chính mình");

  const friendshipRef = collection(firestore, "friendships");

  await addDoc(friendshipRef, {
    id: `${requesterId}_${receiverId}`,
    requesterId,
    receiverId,
    participants: [requesterId, receiverId],
    status: "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

const updateFriendRequest = async (
  friendshipId: string,
  status: "accepted" | "rejected"
) => {
  const friendshipDoc = doc(firestore, "friendships", friendshipId);
  await updateDoc(friendshipDoc, {
    status,
    updatedAt: serverTimestamp(),
  });
};

const listenToFriends = (
  userId: string,
  callback: (friends: FriendShip[]) => void
) => {
  const friendshipsRef = collection(firestore, "friendships");
  const q = query(
    friendshipsRef,
    where("status", "==", "accepted"),
    where("participants", "array-contains", userId)
  );

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(
      (docSnap) =>
        ({
          ...docSnap.data(),
        } as FriendShip)
    );
    callback(data);
  });
};

export { sendFriendRequest, updateFriendRequest, listenToFriends };

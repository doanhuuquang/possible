import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, collection, getDoc } from "firebase/firestore";
import auth from "@/lib/firebase/firebase-auth";
import firestore from "@/lib/firebase/firebase-firestore-database";
import User from "@/lib/models/user";

const createUser = async ({
  email,
  password,
  user,
}: {
  email: string;
  password: string;
  user: User;
}) => {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await setDoc(doc(firestore, "users", credential.user.uid), {
    avatarBase64: user.avatarBase64,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    birthOfDate: user.birthOfDate,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    isVerified: user.isVerified,
  });
};

const getUserById = async (userId: string): Promise<User | null> => {
  const friendsRef = collection(firestore, "users");
  const docSnap = await getDoc(doc(friendsRef, userId));

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as User;
  }

  return null;
};

export { createUser, getUserById };

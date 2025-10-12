"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, onSnapshot } from "firebase/firestore";
import auth from "@/lib/firebase/firebase-auth";
import firestore from "@/lib/firebase/firebase-firestore-database";
import User from "@/lib/models/user";

type UserContextType = {
  user: User | null;
  loading: boolean;
};

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [firebaseUser, authLoading] = useAuthState(auth);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseUser) {
      setUser(null);
      setLoading(false);
      return;
    }

    const docRef = doc(firestore, "users", firebaseUser.uid);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();

        const userInstance = new User({
          id: firebaseUser.uid,
          avatarBase64: data.avatarBase64,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          birthOfDate: data.birthOfDate?.toDate
            ? data.birthOfDate.toDate()
            : new Date(data.birthOfDate),
          createdAt: data.createdAt?.toDate
            ? data.createdAt.toDate()
            : new Date(),
          updatedAt: data.updatedAt?.toDate
            ? data.updatedAt.toDate()
            : new Date(),
          isVerified: data.isVerified,
        });

        setUser(userInstance);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [firebaseUser]);

  return (
    <UserContext.Provider value={{ user, loading: authLoading || loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

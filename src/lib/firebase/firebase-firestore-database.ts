import { getFirestore } from "firebase/firestore";
import app from "@/lib/firebase/config";

const firestore = getFirestore(app);

export default firestore;

import {
  collection,
  query,
  orderBy,
  onSnapshot
} from "firebase/firestore";
import { db } from "./config";

export const listenToTransactions = (customerId, callback) => {
  const ref = collection(db, "customers", customerId, "transactions");
  const q = query(ref, orderBy("createdAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(data);
  });
};

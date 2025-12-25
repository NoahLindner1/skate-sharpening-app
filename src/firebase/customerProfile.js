import {
  doc,
  getDoc,
  updateDoc,
  increment,
  collection,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./config";

export const getCustomerById = async (id) => {
  const ref = doc(db, "customers", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    throw new Error("Customer not found");
  }

  return { id: snap.id, ...snap.data() };
};

export const applyTransaction = async ({
  customerId,
  delta,
  type,
  userEmail
}) => {
  const customerRef = doc(db, "customers", customerId);
  const txRef = collection(db, "customers", customerId, "transactions");

  await updateDoc(customerRef, {
    remaining: increment(delta)
  });

  await addDoc(txRef, {
    delta,
    type,
    userEmail,
    createdAt: serverTimestamp()
  });
};

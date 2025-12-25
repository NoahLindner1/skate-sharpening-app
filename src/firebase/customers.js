import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  increment
} from "firebase/firestore";
import { db } from "./config";

// 🔹 Get all customers for a store
export const getCustomersByStore = async (store) => {
  const q = query(
    collection(db, "customers"),
    where("store", "==", store),
    where("deleted", "==", false), // 👈 ADD THIS
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));
};

// 🔹 Create customer
export const createCustomer = async ({
  name,
  phone,
  email,
  store,
  initialSharpenings = 0
}) => {
  const docRef = await addDoc(collection(db, "customers"), {
    name,
    phone: phone || null,
    email: email || null,
    store,
    remaining: initialSharpenings,
    deleted: false, // 👈 ADD THIS
    createdAt: serverTimestamp()
  });

  // initial transaction
  if (initialSharpenings > 0) {
    await addTransaction(docRef.id, initialSharpenings, "initial");
  }

  return docRef.id;
};

export const updateSharpenings = async (customerId, delta, reason) => {
  const customerRef = doc(db, "customers", customerId);

  // 🔒 Fetch customer first
  const snapshot = await getDocs(
    query(
      collection(db, "customers"),
      where("__name__", "==", customerId)
    )
  );

  const customer = snapshot.docs[0]?.data();

  if (!customer || customer.deleted) {
    throw new Error("Cannot update a deleted customer");
  }

  await updateDoc(customerRef, {
    remaining: increment(delta)
  });

  await addTransaction(customerId, delta, reason);
};

// 🔹 Add transaction
export const addTransaction = async (customerId, delta, reason) => {
  await addDoc(
    collection(db, "customers", customerId, "transactions"),
    {
      delta,
      reason,
      timestamp: serverTimestamp()
    }
  );
};

// 🔹 Get transaction history
export const getTransactions = async (customerId) => {
  const q = query(
    collection(db, "customers", customerId, "transactions"),
    orderBy("timestamp", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));
};

// 🔹 Soft delete customer
export const softDeleteCustomer = async (customerId) => {
  const customerRef = doc(db, "customers", customerId);

  await updateDoc(customerRef, {
    deleted: true
  });
};

// 🔹 Update customer info (name / phone / email)
export const updateCustomerInfo = async (customerId, updates) => {
  const customerRef = doc(db, "customers", customerId);

  await updateDoc(customerRef, {
    ...updates
  });
};

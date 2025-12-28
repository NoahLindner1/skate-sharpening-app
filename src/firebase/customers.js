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

  if (initialSharpenings > 0) {
    await addTransaction(
      docRef.id,
      initialSharpenings,
      "initial",
      "system" // or auth.currentUser.email if you prefer
    );
  }

  return docRef.id;
};

export const updateSharpenings = async (
  customerId,
  delta,
  reason,
  userEmail
) => {
  const customerRef = doc(db, "customers", customerId);

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

  if (customer.remaining + delta < 0) {
    throw new Error("Cannot go below zero");
  }

  await updateDoc(customerRef, {
    remaining: increment(delta)
  });

  await addTransaction(customerId, delta, reason, userEmail);
};

export const addTransaction = async (customerId, delta, type, userEmail) => {
  await addDoc(
    collection(db, "customers", customerId, "transactions"),
    {
      delta,
      type,                // ✅ matches rules
      userEmail,           // ✅ matches rules
      createdAt: serverTimestamp() // ✅ matches rules
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

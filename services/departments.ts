import { db } from "@/services/firebase";
import {
  setDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

export interface IDepartment {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  deletedAt?: Date | null;
}

export async function createDepartment(data: IDepartment) {
  const docref = doc(collection(db, "departments"));
  const dbData = {
    ...data,
    department_id: docref.id,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    deletedAt: null,
    isActive: true,
  };
  await setDoc(docref, dbData);
  return docref;
}

export async function getDepartments() {
  const dpm = query(
    collection(db, "departments"),
    orderBy("createdAt", "desc"),
  );
  const snapshot = await getDocs(dpm);
  return snapshot.docs.map(
    (item) => ({ ...item.data(), id: item.id }) as IDepartment,
  );
}

export async function getDepartmentById(id: string) {
  const dpm = query(
    collection(db, "departments"),
    where("department_id", "==", id),
    where("isActive", "==", true),
    where("deletedAt", "==", null),
    orderBy("createdAt", "desc"),
  );
  const snapshot = await getDocs(dpm);
  return snapshot.docs.map(
    (item) => ({ ...item.data(), id: item.id }) as IDepartment,
  );
}

export async function updateDepartment(id: string, data: IDepartment) {
  const dbData = {
    ...data,
    updatedAt: Timestamp.now(),
  };
  return await updateDoc(doc(db, "departments", id), dbData);
}

export async function deleteDepartment(id: string) {
  return await updateDoc(doc(db, "departments", id), {
    deletedAt: Timestamp.now(),
    isActive: false,
  });
}

export async function restoreDepartment(id: string) {
  return await updateDoc(doc(db, "departments", id), {
    deletedAt: null,
    isActive: true,
  });
}

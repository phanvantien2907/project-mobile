import { db } from "@/services/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

export interface IDepartment {
  id: string;
  name: string;
  code: string;
  description?: string;
  head_of_department?: string;
  deputy_head?: string;
  established_year?: number;
  email?: string;
  phone?: string;
  location?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function createDepartment(data: Omit<IDepartment, "id">) {
  const docref = doc(collection(db, "departments"));
  await setDoc(docref, {
    ...data,
    id: docref.id,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    isActive: true,
  });
  return docref;
}

export async function getDepartments() {
  const q = query(collection(db, "departments"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ ...d.data(), id: d.id }) as IDepartment);
}

export async function getDepartmentById(id: string) {
  const snap = await getDoc(doc(db, "departments", id));
  return snap.exists() ? ({ ...snap.data(), id: snap.id } as IDepartment) : null;
}

export async function updateDepartment(id: string, data: Partial<IDepartment>) {
  return await updateDoc(doc(db, "departments", id), {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteDepartment(id: string) {
  return await deleteDoc(doc(db, "departments", id));
}

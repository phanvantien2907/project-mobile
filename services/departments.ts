import { db } from "@/services/firebase";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

export interface IDepartment {
  id: string;
  name: string; // Tên khoa (e.g. "Khoa Công nghệ Thông tin")
  code: string; // Mã khoa  (e.g. "CNTT")
  description?: string; // Mô tả ngắn
  head_of_department?: string; // Trưởng khoa
  deputy_head?: string; // Phó trưởng khoa
  established_year?: number; // Năm thành lập (e.g. 1995)
  email?: string; // Email liên hệ khoa
  phone?: string; // Số điện thoại văn phòng
  location?: string; // Địa điểm / phòng làm việc (e.g. "Tòa A, Tầng 3")
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export async function createDepartment(data: Omit<IDepartment, "id">) {
  const docref = doc(collection(db, "departments"));
  await setDoc(docref, {
    ...data,
    id: docref.id,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    isActive: true,
    deletedAt: null,
  });
  return docref;
}

export async function getDepartments() {
  const q = query(collection(db, "departments"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ ...d.data(), id: d.id }) as IDepartment);
}

export async function getDepartmentById(id: string) {
  const q = query(collection(db, "departments"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  const found = snapshot.docs.find((d) => d.id === id);
  return found ? ({ ...found.data(), id: found.id } as IDepartment) : null;
}

export async function updateDepartment(id: string, data: Partial<IDepartment>) {
  return await updateDoc(doc(db, "departments", id), {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteDepartment(id: string) {
  return await updateDoc(doc(db, "departments", id), {
    deletedAt: Timestamp.now(),
    isActive: false,
  });
}

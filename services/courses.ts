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

export type CourseType = "required" | "elective" | "general";

export interface ICourse {
  id: string;

  // --- Thông tin môn học ---
  course_code: string; // Mã môn   (e.g. "IT001")
  course_name: string; // Tên môn  (e.g. "Lập trình hướng đối tượng")
  course_credits: number; // Số tín chỉ (1 – 5)
  course_type: CourseType; // Loại môn: bắt buộc / tự chọn / đại cương
  department_id?: string; // FK → departments
  department_name?: string; // Denormalized
  description?: string; // Mô tả môn học
  lecturer?: string; // Giảng viên phụ trách
  semester?: string; // Học kỳ áp dụng (e.g. "HK1", "HK2", "HK1 & HK2")
  max_students?: number; // Sĩ số tối đa mỗi lớp
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export const COURSE_TYPE_OPTIONS: { label: string; value: CourseType }[] = [
  { label: "Bắt buộc", value: "required" },
  { label: "Tự chọn", value: "elective" },
  { label: "Đại cương", value: "general" },
];

export const COURSE_TYPE_CONFIG: Record<
  CourseType,
  { label: string; bg: string; text: string }
> = {
  required: { label: "Bắt buộc", bg: "#FFF0EE", text: "#E74C3C" },
  elective: { label: "Tự chọn", bg: "#EFF4FF", text: "#2667FF" },
  general: { label: "Đại cương", bg: "#F0FDF4", text: "#18A957" },
};

export function getCourseTypeLabel(value?: CourseType | null): string {
  return COURSE_TYPE_OPTIONS.find((o) => o.value === value)?.label ?? "—";
}

export async function createCourse(data: Omit<ICourse, "id">) {
  const docref = doc(collection(db, "courses"));
  return await setDoc(docref, {
    ...data,
    id: docref.id,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    isActive: true,
    deletedAt: null,
  });
}

export async function getCourses() {
  const q = query(collection(db, "courses"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ ...d.data(), id: d.id }) as ICourse);
}

export async function getCourseByID(id: string) {
  const q = query(collection(db, "courses"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  const found = snapshot.docs.find((d) => d.id === id);
  return found ? ({ ...found.data(), id: found.id } as ICourse) : null;
}

export async function updateCourse(id: string, data: Partial<ICourse>) {
  return await setDoc(
    doc(db, "courses", id),
    { ...data, updatedAt: Timestamp.now() },
    { merge: true },
  );
}

export async function deleteCourse(id: string) {
  return await updateDoc(doc(db, "courses", id), {
    deletedAt: Timestamp.now(),
    isActive: false,
  });
}

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
  where,
} from "firebase/firestore";

export type Gender = "male" | "female" | "other";
export type AcademicStatus =
  | "studying"
  | "graduated"
  | "suspended"
  | "dropped_out";

export interface IStudent {
  id: string;
  student_code: string;
  student_name: string;
  student_email: string;
  student_phone?: string;
  gender?: Gender;
  date_of_birth?: string; // ISO format: "YYYY-MM-DD"
  address?: string;
  department_id?: string; // FK → departments
  department_name?: string; // Denormalized để hiển thị nhanh
  academic_year?: string; // e.g. "2022-2026"
  class_name?: string; // e.g. "CNTT-K46"
  gpa?: number; // 0.0 – 4.0
  academic_status?: AcademicStatus;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export const GENDER_OPTIONS: { label: string; value: Gender }[] = [
  { label: "Nam", value: "male" },
  { label: "Nữ", value: "female" },
  { label: "Khác", value: "other" },
];

export const ACADEMIC_STATUS_OPTIONS: {
  label: string;
  value: AcademicStatus;
}[] = [
  { label: "Đang học", value: "studying" },
  { label: "Đã tốt nghiệp", value: "graduated" },
  { label: "Đình chỉ", value: "suspended" },
  { label: "Thôi học", value: "dropped_out" },
];

/** Niên khóa — tự động sinh dải năm 4 năm từ 2015 đến năm hiện tại + 1 */
function generateAcademicYearOptions(): { label: string; value: string }[] {
  const currentYear = new Date().getFullYear();
  const years: { label: string; value: string }[] = [];
  for (let start = currentYear + 1; start >= 2015; start--) {
    const label = `${start}-${start + 4}`;
    years.push({ label, value: label });
  }
  return years;
}

export const ACADEMIC_YEAR_OPTIONS = generateAcademicYearOptions();

export function getGenderLabel(value?: Gender | null): string {
  return GENDER_OPTIONS.find((g) => g.value === value)?.label ?? "—";
}

export function getAcademicStatusLabel(value?: AcademicStatus | null): string {
  return ACADEMIC_STATUS_OPTIONS.find((s) => s.value === value)?.label ?? "—";
}

export async function createStudent(data: Omit<IStudent, "id">) {
  const docref = doc(collection(db, "students"));
  const dbData = {
    ...data,
    id: docref.id,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    isActive: true,
    deletedAt: null,
  };
  return await setDoc(docref, dbData);
}

export async function getStudents() {
  const studentsQuery = query(
    collection(db, "students"),
    orderBy("createdAt", "desc"),
  );
  const snapshot = await getDocs(studentsQuery);
  return snapshot.docs.map(
    (item) => ({ ...item.data(), id: item.id }) as IStudent,
  );
}

export async function getStudentByID(id: string) {
  const studentQuery = query(
    collection(db, "students"),
    where("id", "==", id),
    where("isActive", "==", true),
    where("deletedAt", "==", null),
  );
  const snapshot = await getDocs(studentQuery);
  return snapshot.docs.map(
    (item) => ({ ...item.data(), id: item.id }) as IStudent,
  );
}

export async function updateStudent(id: string, data: Partial<IStudent>) {
  const dbData = {
    ...data,
    updatedAt: Timestamp.now(),
  };
  return await setDoc(doc(db, "students", id), dbData, { merge: true });
}

export async function deleteStudent(id: string) {
  return await updateDoc(doc(db, "students", id), {
    deletedAt: Timestamp.now(),
    isActive: false,
  });
}

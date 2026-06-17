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

export type Gender = "male" | "female" | "other";
export type AcademicStatus = "studying" | "graduated" | "suspended" | "dropped_out";

export interface IStudent {
  id: string;
  student_code: string;
  student_name: string;
  student_email: string;
  student_phone?: string;
  gender?: Gender;
  date_of_birth?: string;
  address?: string;
  department_id?: string;
  department_name?: string;
  academic_year?: string;
  class_name?: string;
  gpa?: number;
  academic_status?: AcademicStatus;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export const GENDER_OPTIONS: { label: string; value: Gender }[] = [
  { label: "Nam", value: "male" },
  { label: "Nữ", value: "female" },
  { label: "Khác", value: "other" },
];

export const ACADEMIC_STATUS_OPTIONS: { label: string; value: AcademicStatus }[] = [
  { label: "Đang học",       value: "studying" },
  { label: "Đã tốt nghiệp", value: "graduated" },
  { label: "Đình chỉ",      value: "suspended" },
  { label: "Thôi học",      value: "dropped_out" },
];

function generateAcademicYearOptions(): { label: string; value: string }[] {
  const currentYear = new Date().getFullYear();
  const years: { label: string; value: string }[] = [];
  for (let start = currentYear + 1; start >= 2015; start--) {
    years.push({ label: `${start}-${start + 4}`, value: `${start}-${start + 4}` });
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
  await setDoc(docref, {
    ...data,
    id: docref.id,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    isActive: true,
  });
  return docref;
}

export async function getStudents() {
  const q = query(collection(db, "students"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ ...d.data(), id: d.id }) as IStudent);
}

export async function getStudentByID(id: string) {
  const snap = await getDoc(doc(db, "students", id));
  return snap.exists() ? [{ ...snap.data(), id: snap.id } as IStudent] : [];
}

export async function updateStudent(id: string, data: Partial<IStudent>) {
  return await updateDoc(doc(db, "students", id), {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteStudent(id: string) {
  return await deleteDoc(doc(db, "students", id));
}

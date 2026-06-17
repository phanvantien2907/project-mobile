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

export type CourseType = "required" | "elective" | "general";

export type CourseBlockKnowledge = "required_knowledge" | "elective_knowledge" | "elective_knowledge_2" | "elective_knowledge_3" | "foreign_language_knowledge";

export interface ICourse {
  id: string;
  course_code: string;
  course_name: string;
  course_credits: number;
  course_type: CourseType;
  course_block?: string;          // Khối kiến thức: e.g. "Kiến thức ngành bắt buộc"
  department_id?: string;
  department_name?: string;
  description?: string;
  lecturer?: string;
  semester?: string;
  semester_period?: string;
  lesson_distribution?: string;
  max_students?: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export const COURSE_TYPE_OPTIONS: { label: string; value: CourseType }[] = [
  { label: "Bắt buộc", value: "required" },
  { label: "Tự chọn",  value: "elective" },
];

export const COURSE_BLOCK_OPTIONS: { label: string; value: CourseBlockKnowledge }[] = [
  { label: "Kiến thức bắt buộc", value: "required_knowledge" },
  { label: "Kiến thức tự chọn", value: "elective_knowledge" },
  { label: "Kiến thức tự chọn 2", value: "elective_knowledge_2" },
  { label: "Kiến thức tự chọn 3", value: "elective_knowledge_3" },
  { label: "Kiến thức ngoại ngữ", value: "foreign_language_knowledge" },
];

export const COURSE_TYPE_CONFIG: Record<CourseType, { label: string; bg: string; text: string }> = {
  required: { label: "Bắt buộc", bg: "#FFF0EE", text: "#E74C3C" },
  elective: { label: "Tự chọn",  bg: "#EFF4FF", text: "#2667FF" },
  general:  { label: "Đại cương", bg: "#F0FDF4", text: "#18A957" },
};

export function getCourseTypeLabel(value?: CourseType | null): string {
  return COURSE_TYPE_OPTIONS.find((o) => o.value === value)?.label ?? "—";
}

export const SEMESTER_PERIOD_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => ({
  label: `Kỳ ${n}`,
  value: String(n),
}));

export const LESSON_DISTRIBUTION_OPTIONS = [
  "0/0/0/45/0/0",
  "0/0/0/60/0/0",
  "0/60/0/0/0/0",
  "0/0/0/0/60/120",
  "4/26/0/0/0/0",
  "15/15/0/0/0/0",
  "15/60/0/0/0/0",
  "20/0/10/0/0/0",
  "30/0/0/0/0/0",
  "30/0/15/0/0/0",
  "30/15/0/0/0/0",
  "30/30/0/0/0/0",
  "45/0/0/0/0/0",
  "45/0/15/0/0/0",
  "60/0/15/0/0/0",
].map((v) => ({ label: v, value: v }));

export const COURSE_BLOCK_LABEL_OPTIONS = [
  "Kiến thức giáo dục đại cương",
  "Kiến thức ngành bắt buộc",
  "Kiến thức ngành tự chọn",
  "Kiến thức cơ sở ngành",
  "Thực tập & Đồ án tốt nghiệp",
].map((v) => ({ label: v, value: v }));

export async function createCourse(data: Omit<ICourse, "id">) {
  const docref = doc(collection(db, "courses"));
  return await setDoc(docref, {
    ...data,
    id: docref.id,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    isActive: true,
  });
}

export async function getCourses() {
  const q = query(collection(db, "courses"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ ...d.data(), id: d.id }) as ICourse);
}

export async function getCourseByID(id: string) {
  const snap = await getDoc(doc(db, "courses", id));
  return snap.exists() ? ({ ...snap.data(), id: snap.id } as ICourse) : null;
}

export async function updateCourse(id: string, data: Partial<ICourse>) {
  return await setDoc(
    doc(db, "courses", id),
    { ...data, updatedAt: Timestamp.now() },
    { merge: true },
  );
}

export async function deleteCourse(id: string) {
  return await deleteDoc(doc(db, "courses", id));
}

import { db } from "@/services/firebase";
import { collection, doc, getDocs, orderBy, query, setDoc, Timestamp, updateDoc, where } from "firebase/firestore";

export interface ICourse {
    id: string;
    department_name: string;
    course_code: string;
    course_name: string;
    course_credits: number;
    createdAt?: Date;
    updatedAt?: Date;
    isActive: boolean;
    deletedAt?: Date | null;
}
export async function createCourse(data: Omit<ICourse, "id">) {
    const docref = doc(collection(db, "courses"));
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

export async function getCourses() {
    const course = query(
        collection(db, "courses"),
        orderBy("createdAt", "desc"),
    );
    const snapshot = await getDocs(course);
    return snapshot.docs.map((item) => ({ ...item.data(), id: item.id }) as ICourse);
}

export async function getCourseByID(id: string) {
    const course = query(
        collection(db, "courses"),
        where("id", "==", id),
        where("isActive", "==", true),
        where("deletedAt", "==", null),
    );
    const snapshot = await getDocs(course);
    return snapshot.docs.map((item) => ({ ...item.data(), id: item.id }) as ICourse);
}
export async function updateCourse(id: string, data: Partial<ICourse>) {
    const dbData = {
        ...data,
        updatedAt: Timestamp.now(),
    };
    return await setDoc(doc(db, "courses", id), dbData);
}
export async function deleteCourse(id: string) {
    return await updateDoc(doc(db, "courses", id), {
        deletedAt: Timestamp.now(),
        isActive: false,
    });
}

export async function restoreCourse(id: string) {
    return await updateDoc(doc(db, "courses", id), {
        deletedAt: null,
        isActive: true,
    });
}
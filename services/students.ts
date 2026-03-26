import { db } from "@/services/firebase";
import { collection, doc, getDocs, orderBy, query, setDoc, Timestamp, updateDoc, where } from "firebase/firestore";

export interface IStudent {
    id: string;
    student_code: string;
    student_name: string;
    student_email: string;
    student_phone?: string;
    course_id?: string;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
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
    return snapshot.docs.map((item) => ({ ...item.data(), id: item.id }) as IStudent);
}

export async function getStudentByID(id: string) {
    const studentQuery = query(
        collection(db, "students"),
        where("id", "==", id),
        where("isActive", "==", true),
        where("deletedAt", "==", null),
    );
    const snapshot = await getDocs(studentQuery);
    return snapshot.docs.map((item) => ({ ...item.data(), id: item.id }) as IStudent);
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

export async function restoreStudent(id: string) {
    return await updateDoc(doc(db, "students", id), {
        deletedAt: null,
        isActive: true,
    });
}

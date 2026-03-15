import { db } from "@/services/firebase";
import { addDoc, collection, doc, getDocs, Timestamp, updateDoc } from "firebase/firestore";

export interface IDepartment {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    deletedAt?: Date | null;
}

export async function createDepartment(data: IDepartment) {
    const dbData = {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        isActive: true
    }
    return await addDoc(collection(db, "departments"), dbData);
}

export async function getDepartments() {
    const dpm = await getDocs(collection(db, "departments"));
    return dpm.docs.map(item => item.data() as IDepartment);
}

export async function updateDepartment(id: string, data: IDepartment) {
    const dbData = {
        ...data,
        updatedAt: Timestamp.now(),
    }
    return await updateDoc(doc(db, "departments", id), dbData);
}

export async function deleteDepartment(id: string) {
    return await updateDoc(doc(db, "departments", id), {
        deletedAt: Timestamp.now(),
        isActive: false
    });
}

export async function restoreDepartment(id: string) {
    return await updateDoc(doc(db, "departments", id), {
        deletedAt: null,
        isActive: true
    });
}
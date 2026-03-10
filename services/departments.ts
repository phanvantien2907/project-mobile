import { db } from "@/services/firebase";
import { addDoc, collection, getDocs, Timestamp } from "firebase/firestore";

export interface Department {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    deletedAt?: Date | null;
}

export async function createDepartment(data: Department) {
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
    return dpm.docs.map(item => item.data() as Department);
}
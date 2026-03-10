import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, setDoc, updateDoc, serverTimestamp, Timestamp } from "firebase/firestore";

export async function register(email: string, password: string) {
  try {
    const createUser = await createUserWithEmailAndPassword(auth, email, password);
    const savedUser = await setDoc(doc(db, "users", createUser.user.uid), {
      user_id: createUser.user.uid,
      user_email: createUser.user.email,
      user_createdAt: Timestamp.now(),
      user_updatedAt: Timestamp.now(),
      user_role: 'staff',
      user_is_active: true,
      user_lastLoginAt: null,
      user_deletedAt: null
    });
    return savedUser;
  } catch (error) {
    console.error("Đã có lỗi xảy ra!", error);
    throw error;
  }
}

export async function login(email: string, password: string) {
  try {
    const loginUser = await signInWithEmailAndPassword(auth, email, password);
    await updateDoc(doc(db, "users", loginUser.user.uid), {
      user_updatedAt: Timestamp.now(),
      user_lastLoginAt: Timestamp.now(),
    });
    return loginUser;
  } catch (error) {
    console.error("Đã có lỗi xảy ra!", error);
    throw error;
  }
}

export async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Đã có lỗi xảy ra!", error);
    throw error;
  }
}


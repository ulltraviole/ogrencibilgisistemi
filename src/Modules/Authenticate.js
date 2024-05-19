import { auth } from "./Firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default async function Authenticate(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw error;
  }
}

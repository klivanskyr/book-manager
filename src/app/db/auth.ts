import { auth } from "@/firebase/firebase";
import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";

export async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    
    try {
        await signInWithRedirect(auth, provider);
    } catch (error) {
        return;
    }
}

export async function signOut() {
    try {
        await auth.signOut();
    } catch (error) {
        return;
    }
}
import { auth } from "@/firebase/firebase";
import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";

export async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    
    try {
        await signInWithRedirect(auth, provider);
        console.log('Sign in with Google successful');
    } catch (error) {
        console.log(error);
    }
}

export async function signOut() {
    try {
        await auth.signOut();
        console.log('Sign out successful');
    } catch (error) {
        console.log(error);
    }
}
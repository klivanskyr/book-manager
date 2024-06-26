import { auth } from "@/firebase/firebase";
import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";

export function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    provider.setCustomParameters({
        prompt: 'select_account'
    });
    
    try {
        console.log('Signing in with Google, HERE');
        signInWithRedirect(auth, provider);
    } catch (error) {
        console.error('Error signing in with Google:', error);
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
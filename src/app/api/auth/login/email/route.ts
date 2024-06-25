import { getUserByEmail } from "@/app/db";
import { auth } from "@/firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        if (!req.headers.get("content-type")?.includes("application/json")) { return NextResponse.json({ code: 400, message: "Requires JSON" }); }

        const body = await req.json();
        const { email, password } = body;

        if (email === undefined || password === undefined) {
            return NextResponse.json({ code: 400, message: "Missing parameters, requires email, password" });
        }

        const userObj = await getUserByEmail(email);
        if (!userObj) {
            return NextResponse.json({ code: 404, message: "User not found" });
        }
        if (userObj.loginMethod === 'google') {
            return NextResponse.json({ code: 400, message: "User logged in with Google. Use /api/login/google" });
        }

        const userCredential = await signInWithEmailAndPassword(auth, userObj.email, password)
        if (userCredential) {
            const user = userCredential.user;
            const idToken = await user.getIdToken()
            if (idToken) {
                const res = NextResponse.json({ code: 200, message: "Logged in", userId: user.uid, token: idToken });
                res.cookies.set('token', idToken );
                return res;
            } else {
                return NextResponse.json({ code: 401, message: "Invalid token" });
            }
        } else {
            return NextResponse.json({ code: 401, message: "Invalid credentials" });
        }

    } catch (error) {
        return NextResponse.json({ code: 500, message: "Internal server error" });
    }
}
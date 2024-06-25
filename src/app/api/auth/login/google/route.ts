import { getUserByEmail } from "@/app/db";
import { adminAuth } from "@/firebase/firebase-admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    if (!req.headers.get("content-type")?.includes("application/json")) { return NextResponse.json({ code: 400, message: "Requires JSON" }); }

    const body = await req.json();
    const { email, idToken } = body;

    if (email === undefined) {
        return NextResponse.json({ code: 400, message: "Missing parameters, requires email" });
    }

    const userObj = await getUserByEmail(email);

    if (!userObj) {
        return NextResponse.json({ code: 404, message: "User not found" });
    }
    if (userObj.loginMethod === 'email') {
        return NextResponse.json({ code: 400, message: "User logged in with Email. Use /api/login/email" });
    }

    adminAuth.verifyIdToken(idToken)
    .then((decodedToken) => {
        const ret = NextResponse.json({ code: 200, message: "Logged in", uid: decodedToken.uid });
        ret.cookies.set('token', idToken);
        return ret;
    })
    .catch((error) => {
        return NextResponse.json({ code: 401, message: "Invalid token" });
    });
}
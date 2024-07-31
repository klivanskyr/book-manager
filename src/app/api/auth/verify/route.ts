import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/firebase/firebase-admin";

export async function POST(req: NextRequest) {
    console.log("POST /api/auth/verify");
    try {
        console.log("Cookies: ", cookies().get('token'));
        const token = cookies().get('token');        

        console.log("Token: ", token);
        if (!token) {
            return NextResponse.json({ code: 400, message: "No token found" });
        }
        
        console.log("Verifying token...");
        const res = await adminAuth.verifyIdToken(token.value);
        console.log("Token verified: ", res);
        if (!res) {
            return NextResponse.json({ code: 401, message: "Invalid token" });
        } else {
            return NextResponse.json({ code: 200, message: "Valid token", uid: res.uid });
        }

    } catch (error) {
        console.log("Error: ", error);
        return NextResponse.json({ code: 500, message: `Internal Server Error: ${error}` }, { status: 500 });
    }
}
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/firebase/firebase-admin";

export async function POST(req: NextRequest) {
    try {
        const token = cookies().get('token');        

        if (!token) {
            return NextResponse.json({ code: 400, message: "No token found" });
        }
        
        const res = await adminAuth.verifyIdToken(token.value);
        if (!res) {
            return NextResponse.json({ code: 401, message: "Invalid token" });
        } else {
            return NextResponse.json({ code: 200, message: "Valid token" });
        }

    } catch (error) {
        return NextResponse.json({ code: 500, message: "Internal Server Error" });
    }
}
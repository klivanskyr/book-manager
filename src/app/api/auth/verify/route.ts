import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    try {
        const token = cookies().get('token');        

        if (!token) {
            return NextResponse.json({ code: 400, message: "No token found" });
        }
        try {
            jwt.verify(token.value, process.env.JWT_SECRET as string);
            return NextResponse.json({ code: 200, message: "Token is valid", jwt: jwt.decode(token.value) });
        } catch (error) {
            return NextResponse.json({ code: 400, message: "Invalid token" });
        }
    } catch (error) {
        return NextResponse.json({ code: 500, message: "Internal Server Error" });
    }
}
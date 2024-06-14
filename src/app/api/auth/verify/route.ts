import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { token } = body;

        if (!token) {
            return NextResponse.json({ code: 400, message: "Missing parameters, requires token" });
        }

        try {
            jwt.verify(token, process.env.JWT_SECRET);
            return NextResponse.json({ code: 200, message: "Token is valid"});
        } catch (error) {
            return NextResponse.json({ code: 400, message: "Invalid token" });
        }
    } catch (error) {
        return NextResponse.json({ code: 500, message: "Internal Server Error" });
    }
}
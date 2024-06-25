import { getUserByEmail } from "@/app/db";
import { compare } from "bcrypt-ts";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
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
        const token = jwt.sign(
            { userId: userObj.id },
            process.env.JWT_SECRET as string,
            { expiresIn: "1h" }
        );
        const res = NextResponse.json({ code: 200, message: "Logged in", userId: userObj.id });
        res.cookies.set('token', token);
        return res;
    }

    if (await compare(password, userObj.password)) {
        const token = jwt.sign(
            { userId: userObj.id },
            process.env.JWT_SECRET as string,
            { expiresIn: "1h" }
        );
        const res = NextResponse.json({ code: 200, message: "Logged in", userId: userObj.id });
        res.cookies.set('token', token);
        return res;
    } else {
        return NextResponse.json({ code: 401, message: "Incorrect password" });
    }
}
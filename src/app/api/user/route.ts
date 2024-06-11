import { NextResponse, NextRequest } from "next/server";
import { getUser, postUser } from './helpers';

export async function GET(req: NextRequest, res: NextResponse) {
    const { searchParams } = new URL(req.nextUrl);
    const params = Array.from(searchParams);
    console.log(params);

    if (params.length === 0) {
        return NextResponse.json({ code: 400, message: "No parameters provided, requires email" });
    } else if (params.length > 1) {
        return NextResponse.json({ code: 400, message: "Too many parameters provided, requires email" });
    } else {
        const email = params.find(([key, value]) => key === 'email');

        if (email) {
            const id = await getUser(email[1]);
            if (!id) {
                return NextResponse.json({ code: 400, message: "User not found" });
            }
            return NextResponse.json({ code: 200, userId: id });
        } else {
            return NextResponse.json({ code: 400, message: "Missing parameters, requires email" });
        }
    }
}

export async function POST(req: NextRequest, res: NextResponse) {
    const { searchParams } = new URL(req.nextUrl);
    const params = Array.from(searchParams);
    console.log(params);

    if (params.length === 0) {
        return NextResponse.json({ code: 400, message: "No parameters provided, requires email" });
    } else if (params.length > 3) {
        return NextResponse.json({ code: 400, message: "Too many parameters provided, requires email, username, password" });
    } else if (params.length < 3) {
        return NextResponse.json({ code: 400, message: "Missing parameters, requires email, username, password" });
    } else {
        const email = params.find(([key, value]) => key === 'email');
        const password = params.find(([key, value]) => key === 'password');
        const username = params.find(([key, value]) => key === 'username');

        if (email && password && username) {
            const id = await postUser(username[1], email[1], password[1]);
            if (!id) {
                return NextResponse.json({ code: 400, message: "User not created" });
            }
            return NextResponse.json({ code: 200, userId: id });
        } else {
            return NextResponse.json({ code: 400, message: "Missing parameters, requires email, username, password" });
        }
    }
}
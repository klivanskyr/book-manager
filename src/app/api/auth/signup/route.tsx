import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { username, email, password } = body;

        if (username === undefined || email === undefined || password === undefined) {
            return NextResponse.json({ code: 400, message: "Missing parameters, requires email, password" });
        }

        const hashedpassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username: username,
                email: email,
                password: hashedpassword
            }
        });

        return NextResponse.json({ code: 200, userId: user.id });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ code: 400, message: "Invalid request body" });
    }
}
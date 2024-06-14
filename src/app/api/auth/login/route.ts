import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


async function login(email: string, password: string): Promise<{ token: string, id: number } | null>{
    //pull the user
    const user = await prisma.user.findUnique({
        where: {
            email,
        }
    });

    if (user && await bcrypt.compare(password, user.password)) { //check if passwords match
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        return { token, id: user.id }
    }

    return null;
    
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (email === undefined || password === undefined) {
            return NextResponse.json({ code: 400, message: "Missing parameters, requires email, password" });
        }

        const user = await prisma.user.findUnique({
            where: {
                email,
            }
        });

        if (!user) { return NextResponse.json({ code: 400, message: "User not found" }); }

        if (await bcrypt.compare(password, user.password)) { //check if passwords match
            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
           
            const res = NextResponse.json({ code: 200, userId: user.id });
            res.cookies.set('token', token);
            return res;
        } else {
            return NextResponse.json({ code: 400, message: "Invalid password" });
        }

    } catch (error) {
        return NextResponse.json({ code: 400, message: "Invalid request body" });
    }
}
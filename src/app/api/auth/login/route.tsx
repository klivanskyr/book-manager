import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


async function login(email: string, password: string): Promise<{ token: string, id: number } | null>{

    //pull the user
    const user = await prisma.user.findUnique({
        where: {
            email: email,
        }
    });

    if (user && await bcrypt.compare(password, user.password)) { //check if passwords match
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        return { token: token, id: user.id }
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


        const apiRes: { token: string, id: number } | null = await login(email, password);
        
        if (!apiRes) {
            return NextResponse.json({ code: 400, message: "User not found" });
        }

        const res = NextResponse.json({ code: 200, userId: apiRes.id });
        res.cookies.set('token', apiRes.token);
        return res;

    } catch (error) {
        console.log(error);
        return NextResponse.json({ code: 400, message: "Invalid request body" });
    }
}
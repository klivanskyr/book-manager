import { NextRequest, NextResponse } from "next/server";

export function DELETE(req: NextRequest): NextResponse {
    try {
        const token = req.cookies.get('token');

        if (!token) {
            return NextResponse.json({ code: 400, message: 'User not logged in' });
        }

        // Delete the token cookie
        const response = NextResponse.json({ code: 200, message: 'User logged out' });
        response.cookies.delete('token');
        return response;
        
    } catch (error) {
        return NextResponse.json({ code: 500, message: "Internal Server Error" })
    }
}
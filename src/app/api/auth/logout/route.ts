import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export function DELETE(req: NextRequest) {
    try {
        const token = cookies().get('token');
        if (!token) {
            return new Response(null, { status: 400, statusText: 'No token found' });
        } else {
            cookies().delete('token');
            return new Response(null, { status: 200, statusText: 'Logged out' });
        }
    } catch (error) {
        return new Response(null, { status: 500, statusText: 'Internal Server Error' });
    }
}
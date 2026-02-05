import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    // Protect Teacher Portal (Teachers)
    // Dashboard is now public for students

    // Protect Teacher Portal (Teachers)
    if (pathname.startsWith('/teacher')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
        if (token.role !== 'teacher') {
            return NextResponse.redirect(new URL('/dashboard', req.url)); // Redirect unauthorized students to dashboard
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/teacher/:path*'],
};

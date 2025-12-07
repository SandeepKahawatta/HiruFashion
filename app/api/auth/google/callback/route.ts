import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import User from '@/lib/models/User';
import { setSessionCookie, setWelcomeCookie } from '@/lib/auth';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
        return NextResponse.redirect(new URL('/login?error=google_auth_failed', req.url));
    }

    if (!code) {
        return NextResponse.redirect(new URL('/login?error=no_code', req.url));
    }

    try {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/google/callback`;

        // 1. Exchange code for tokens
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: clientId!,
                client_secret: clientSecret!,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
            }),
        });

        const tokenData = await tokenRes.json();
        if (!tokenRes.ok) {
            console.error('Google token error:', tokenData);
            throw new Error('Failed to get tokens');
        }

        // 2. Get user info
        const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });
        const userData = await userRes.json();

        if (!userData.email) {
            throw new Error('No email provided by Google');
        }

        await dbConnect();

        // 3. Find or create user
        let user = await User.findOne({ email: userData.email });

        if (!user) {
            // Create new user
            user = await User.create({
                name: userData.name || userData.email.split('@')[0],
                email: userData.email,
                googleId: userData.id,
                role: userData.email === process.env.ADMIN_EMAIL ? 'admin' : 'user',
            });
        } else if (!user.googleId) {
            // Link existing user to Google
            user.googleId = userData.id;
            await user.save();
        }

        // 4. Set session
        setSessionCookie({ userId: user._id.toString(), role: user.role, email: user.email });
        setWelcomeCookie();

        return NextResponse.redirect(new URL('/', req.url));

    } catch (err) {
        console.error('Google auth error:', err);
        return NextResponse.redirect(new URL('/login?error=server_error', req.url));
    }
}

import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db();

    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    const user = await db.collection('users').findOne(
        { email },
        { projection: { _id: 1, name: 1, email: 1, password: 1, role: 1 } }
    );

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // In a real app, you would create and return a session token (e.g., JWT) here.
    // For now, we return a success message and user info without the password.
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: 'Login successful',
      user: userWithoutPassword,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
    }
    // Do not log the error here as it can cause secondary crashes on some platforms.
    // The hosting environment should handle logging.
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}

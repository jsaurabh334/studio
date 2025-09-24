import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    const user = await db.collection('users').findOne(
        { email },
        // Explicitly project the password field to ensure it's returned
        { projection: { name: 1, email: 1, password: 1, role: 1 } }
    );

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Ensure user.password is a string before comparing
    if (typeof user.password !== 'string') {
        // This case should ideally not happen if data integrity is maintained
        console.error("User password is not a string for user:", email);
        return NextResponse.json({ error: 'Authentication error' }, { status: 500 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }
    
    // In a real app, you would create a session/JWT here.
    // For now, we'll just return a success message.
    
    // IMPORTANT: Do not return the password hash in the response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ message: 'Login successful', user: userWithoutPassword });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Login API Error:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}

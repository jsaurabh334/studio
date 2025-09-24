import { NextResponse } from 'next/server';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// This is a placeholder for a real user database.
const users = [
    { id: 1, email: 'admin@example.com', password: 'password', name: 'Admin User' }
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    // In a real app, you would:
    // 1. Find the user in your database by email.
    // 2. Compare the provided password with the stored hashed password.
    const user = users.find(u => u.email === email);

    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // In a real app, you would create a session here (e.g., with a JWT or next-auth).
    // For now, we'll just return a success message.
    
    return NextResponse.json({ message: 'Login successful', user: { name: user.name, email: user.email } });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

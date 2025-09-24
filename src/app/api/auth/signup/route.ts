import { NextResponse } from 'next/server';
import { z } from 'zod';

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedBody = signupSchema.parse(body);

    // In a real application, you would:
    // 1. Check if a user with this email already exists.
    // 2. Hash the password.
    // 3. Save the new user to your database.
    
    console.log("New user signup:", parsedBody);

    // For now, we'll just return a success message.
    return NextResponse.json({ message: 'User created successfully', user: { name: parsedBody.name, email: parsedBody.email } });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    // You could add a specific check for duplicate emails here if you were using a database.
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

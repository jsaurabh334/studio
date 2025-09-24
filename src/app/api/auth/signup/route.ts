import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';
import { projects as initialProjects } from '@/lib/data';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db();

    const body = await request.json();
    const { name, email, password } = signupSchema.parse(body);

    const usersCollection = db.collection('users');
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    // Seed database with projects if this is the first user
    const userCount = await usersCollection.countDocuments();
    if (userCount === 0) {
        const projectsCollection = db.collection('projects');
        const projectCount = await projectsCollection.countDocuments();
        if (projectCount === 0) {
            // Remove the MongoDB "_id" if it exists, as MongoDB will generate it.
            const projectsToInsert = initialProjects.map(({ ...rest }) => rest);
            await projectsCollection.insertMany(projectsToInsert);
        }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.collection('users').insertOne({
      name,
      email,
      password: hashedPassword,
      role: 'Admin', // Default role for new users
      createdAt: new Date(),
    });

    const user = {
      id: result.insertedId,
      name,
      email,
      role: 'Admin',
    };

    return NextResponse.json({ message: 'User created successfully', user }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    // Do not log the error here as it can cause secondary crashes on some platforms.
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}

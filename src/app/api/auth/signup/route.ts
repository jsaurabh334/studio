<<<<<<< HEAD
import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';
import { projects as initialProjects } from '@/lib/data';
=======
import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";
>>>>>>> 97a68769de906ebc5573162d44e50193d944deba

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("SIGNUP body:", body);
    const { name, email, password } = signupSchema.parse(body);

    const client = await clientPromise;
    const db = client.db();

<<<<<<< HEAD
    const body = await request.json();
    const { name, email, password } = signupSchema.parse(body);

    const usersCollection = db.collection('users');
    const existingUser = await usersCollection.findOne({ email });
=======
    const existingUser = await db.collection("users").findOne({ email });
>>>>>>> 97a68769de906ebc5573162d44e50193d944deba
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists." }, { status: 400 });
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
    const result = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

<<<<<<< HEAD
    const user = {
      id: result.insertedId,
      name,
      email,
      role: 'Admin',
    };
=======
    return NextResponse.json({
      message: "Signup successful",
      user: { id: result.insertedId.toString(), name, email },
    }, { status: 201 });
>>>>>>> 97a68769de906ebc5573162d44e50193d944deba

  } catch (err: any) {
    console.error("SIGNUP error:", err);
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors.map(e => e.message).join(", ") }, { status: 400 });
    }
<<<<<<< HEAD
    // Do not log the error here as it can cause secondary crashes on some platforms.
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
=======
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
>>>>>>> 97a68769de906ebc5573162d44e50193d944deba
  }
}
// After successful signup, you might want to log the user in automatically.
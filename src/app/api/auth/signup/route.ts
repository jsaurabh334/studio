import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

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

    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return NextResponse.json({
      message: "Signup successful",
      user: { id: result.insertedId.toString(), name, email },
    }, { status: 201 });

  } catch (err: any) {
    console.error("SIGNUP error:", err);
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors.map(e => e.message).join(", ") }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
// After successful signup, you might want to log the user in automatically.
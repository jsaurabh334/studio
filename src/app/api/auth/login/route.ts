import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("LOGIN body:", body);
    const { email, password } = loginSchema.parse(body);

    const client = await clientPromise;
    const db = client.db();

    const user = await db.collection("users").findOne({ email });
    if (!user || !user.password) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // remove password and stringify _id
    const { password: _, ...userWithoutPassword } = user as any;
    if (userWithoutPassword._id) userWithoutPassword._id = userWithoutPassword._id.toString();

    return NextResponse.json({ message: "Login successful", user: userWithoutPassword }, { status: 200 });

  } catch (err: any) {
    console.error("LOGIN error:", err);
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors.map(e => e.message).join(", ") }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
// Consider implementing session management or JWT for maintaining user sessions after login.
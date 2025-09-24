
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import type { Project } from '@/lib/data';

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db();

    const projectsCollection = db.collection<Project>('projects');
    const projects = await projectsCollection.find({}).toArray();

    // The _id field from MongoDB is an ObjectId, which is not directly serializable.
    const serializableProjects = projects.map(project => ({
      ...project,
      _id: project._id.toString(),
    }));

    return NextResponse.json({ projects: serializableProjects });
  } catch (error) {
    // Do not log the error here as it can cause secondary crashes on some platforms.
    // The hosting environment should handle logging.
    return NextResponse.json({ error: 'An internal server error occurred while fetching projects.' }, { status: 500 });
  }
}

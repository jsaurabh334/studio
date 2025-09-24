
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db();

    // The current user data doesn't have collections, so we will insert some if the collection is empty.
    const projectsCollection = db.collection('projects');
    let projects = await projectsCollection.find({}).toArray();

    if (projects.length === 0) {
      // If no projects, insert the mock data.
      const initialProjects = [
        { 
          id: 'PROJ-001', 
          name: 'Downtown High-Rise', 
          description: 'A 40-story commercial office building in the heart of the city. Features a modern glass facade and sustainable energy systems.',
          progress: 75, 
          budget: 5000000, 
          spent: 3750000, 
          status: 'On Track',
          tasks: [
            { id: 'TASK-101', title: 'Finalize structural steel framework', status: 'Done', dueDate: '2024-07-20' },
            { id: 'TASK-102', title: 'Install curtain wall panels (Floors 20-30)', status: 'In Progress', dueDate: '2024-08-15' },
            { id: 'TASK-103', title: 'Begin interior electrical wiring', status: 'To Do', dueDate: '2024-08-01' },
            { id: 'TASK-104', title: 'HVAC system installation for lower levels', status: 'In Progress', dueDate: '2024-08-10' },
          ],
          assignedContractors: ['CONT-01', 'CONT-04'],
          expenses: [
              { id: 'EXP-001', category: 'Materials', description: 'Structural Steel Beams', amount: 1500000, date: '2024-06-15' },
              { id: 'EXP-002', category: 'Labor', description: 'Q2 Contractor Payments', amount: 800000, date: '2024-06-30' },
          ]
        },
        { 
          id: 'PROJ-002', 
          name: 'Suburban Bridge', 
          description: 'A two-lane concrete bridge spanning the Green River, replacing an older, structurally deficient bridge.',
          progress: 40, 
          budget: 1200000, 
          spent: 600000, 
          status: 'Delayed',
          tasks: [
            { id: 'TASK-201', title: 'Complete foundation piling on east bank', status: 'Done', dueDate: '2024-07-10' },
          ],
          assignedContractors: ['CONT-02'],
          expenses: []
        },
      ];
      await projectsCollection.insertMany(initialProjects);
      projects = await projectsCollection.find({}).toArray();
    }

    // The _id field from MongoDB is an ObjectId, which is not directly serializable.
    const serializableProjects = projects.map(project => ({
      ...project,
      _id: project._id.toString(),
    }));

    return NextResponse.json({ projects: serializableProjects });
  } catch (error) {
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}

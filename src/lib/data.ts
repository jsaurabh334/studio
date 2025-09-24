
export type Task = {
  id: string;
  title: string;
  status: 'To Do' | 'In Progress' | 'Done';
  dueDate: string;
}

export type Project = {
  id: string;
  name: string;
  description: string;
  progress: number;
  budget: number;
  spent: number;
  status: 'On Track' | 'Delayed' | 'Completed';
  tasks: Task[];
  assignedContractors: string[]; // Array of contractor IDs
};

export type Contractor = {
  id: string;
  name: string;
  company: string;
  status: 'Active' | 'Inactive';
  projectCount: number;
  avatar: string;
};

export type Payment = {
  id: string;
  projectId: string;
  projectName: string;
  contractorName: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending';
  invoiceId: string;
};

export type Alert = {
  id: string;
  type: 'delay' | 'stock' | 'payment' | 'safety';
  title: string;
  description: string;
  projectId: string;
  date: string;
  read: boolean;
};

export type RecentActivity = {
  id: number;
  user: string;
  action: string;
  time: string;
};

export const projects: Project[] = [
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
    assignedContractors: ['CONT-01', 'CONT-04']
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
      { id: 'TASK-202', title: 'Pour concrete for main support columns', status: 'In Progress', dueDate: '2024-07-30' },
      { id: 'TASK-203', title: 'Await delivery of prefabricated deck segments', status: 'To Do', dueDate: '2024-08-05' },
    ],
    assignedContractors: ['CONT-02']
  },
  { 
    id: 'PROJ-003', 
    name: 'Residential Complex', 
    description: 'A multi-building complex with 200 residential units, a community center, and underground parking.',
    progress: 95, 
    budget: 8500000, 
    spent: 8000000, 
    status: 'On Track',
    tasks: [
      { id: 'TASK-301', title: 'Finalize landscaping and exterior lighting', status: 'In Progress', dueDate: '2024-08-05' },
      { id: 'TASK-302', title: 'Conduct final unit inspections and punch lists', status: 'In Progress', dueDate: '2024-08-20' },
      { id: 'TASK-303', title: 'Obtain certificate of occupancy', status: 'To Do', dueDate: '2024-08-30' },
    ],
    assignedContractors: ['CONT-01', 'CONT-02', 'CONT-04']
  },
  { 
    id: 'PROJ-004', 
    name: 'City Park Renovation',
    description: 'Renovation of the central city park, including new playgrounds, a new irrigation system, and refurbishment of public restrooms.',
    progress: 100, 
    budget: 500000, 
    spent: 480000, 
    status: 'Completed',
    tasks: [
      { id: 'TASK-401', title: 'Install new playground equipment', status: 'Done', dueDate: '2024-06-15' },
      { id: 'TASK-402', title: 'Complete final project handover', status: 'Done', dueDate: '2024-07-01' },
    ],
    assignedContractors: []
  },
];

export const contractors: Contractor[] = [
  { id: 'CONT-01', name: 'John Doe', company: 'BuildRight Inc.', status: 'Active', projectCount: 2, avatar: 'avatar-1' },
  { id: 'CONT-02', name: 'Jane Smith', company: 'Innovate Construct', status: 'Active', projectCount: 1, avatar: 'avatar-5' },
  { id: 'CONT-03', name: 'Mike Johnson', company: 'Foundation Co.', status: 'Inactive', projectCount: 0, avatar: 'avatar-3' },
  { id: 'CONT-04', name: 'Emily Davis', company: 'SkyHigh Builders', status: 'Active', projectCount: 1, avatar: 'avatar-2' },
];

export const payments: Payment[] = [
  { id: 'PAY-001', projectId: 'PROJ-001', projectName: 'Downtown High-Rise', contractorName: 'BuildRight Inc.', amount: 50000, date: '2024-07-15', status: 'Paid', invoiceId: 'INV-1023' },
  { id: 'PAY-002', projectId: 'PROJ-002', projectName: 'Suburban Bridge', contractorName: 'Innovate Construct', amount: 25000, date: '2024-07-20', status: 'Pending', invoiceId: 'INV-1024' },
  { id: 'PAY-003', projectId: 'PROJ-003', projectName: 'Residential Complex', contractorName: 'SkyHigh Builders', amount: 120000, date: '2024-06-30', status: 'Paid', invoiceId: 'INV-1020' },
  { id: 'PAY-004', projectId: 'PROJ-001', projectName: 'Downtown High-Rise', contractorName: 'BuildRight Inc.', amount: 75000, date: '2024-08-01', status: 'Pending', invoiceId: 'INV-1025' },
];

export const alerts: Alert[] = [
  { id: 'ALERT-01', type: 'delay', title: 'Potential Delay Detected', description: 'Foundation work is 5 days behind schedule due to material delivery issues.', projectId: 'PROJ-002', date: '2024-07-28T10:00:00Z', read: false },
  { id: 'ALERT-02', type: 'stock', title: 'Low Stock: Cement', description: 'Stock for cement is below the 15% threshold. Reorder is recommended.', projectId: 'PROJ-001', date: '2024-07-27T14:30:00Z', read: false },
  { id: 'ALERT-03', type: 'payment', title: 'Overdue Payment', description: 'Invoice INV-1024 to Innovate Construct is 3 days overdue.', projectId: 'PROJ-002', date: '2024-07-26T09:00:00Z', read: true },
  { id: 'ALERT-04', type: 'safety', title: 'Upcoming safety inspection required', description: 'Upcoming safety inspection for scaffolding on floor 15.', projectId: 'PROJ-001', date: '2024-07-25T11:00:00Z', read: true },
];

export const recentActivities: RecentActivity[] = [
  { id: 1, user: 'Supervisor Mark', action: 'submitted daily report for PROJ-001.', time: '2024-07-29T14:00:00Z' },
  { id: 2, user: 'Admin', action: 'approved payment for INV-1023.', time: '2024-07-29T11:00:00Z' },
  { id: 3, user: 'System', action: 'generated a low stock alert for Steel Beams.', time: '2024-07-28T09:00:00Z' },
  { id: 4, user: 'Jane Smith', action: 'updated task "Electrical Wiring" to Completed.', time: '2024-07-27T16:00:00Z' },
];

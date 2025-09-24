export type Project = {
  id: string;
  name: string;
  progress: number;
  budget: number;
  spent: number;
  status: 'On Track' | 'Delayed' | 'Completed';
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
  { id: 'PROJ-001', name: 'Downtown High-Rise', progress: 75, budget: 5000000, spent: 3750000, status: 'On Track' },
  { id: 'PROJ-002', name: 'Suburban Bridge', progress: 40, budget: 1200000, spent: 600000, status: 'Delayed' },
  { id: 'PROJ-003', name: 'Residential Complex', progress: 95, budget: 8500000, spent: 8000000, status: 'On Track' },
  { id: 'PROJ-004', name: 'City Park Renovation', progress: 100, budget: 500000, spent: 480000, status: 'Completed' },
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
  { id: 'ALERT-04', type: 'safety', title: 'Safety Inspection Required', description: 'Upcoming safety inspection for scaffolding on floor 15.', projectId: 'PROJ-001', date: '2024-07-25T11:00:00Z', read: true },
];

export const recentActivities: RecentActivity[] = [
  { id: 1, user: 'Supervisor Mark', action: 'submitted daily report for PROJ-001.', time: '2024-07-29T14:00:00Z' },
  { id: 2, user: 'Admin', action: 'approved payment for INV-1023.', time: '2024-07-29T11:00:00Z' },
  { id: 3, user: 'System', action: 'generated a low stock alert for Steel Beams.', time: '2024-07-28T09:00:00Z' },
  { id: 4, user: 'Jane Smith', action: 'updated task "Electrical Wiring" to Completed.', time: '2024-07-27T16:00:00Z' },
];

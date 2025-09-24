import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { projects, contractors, payments } from "@/lib/data";
import { DollarSign, Percent, Briefcase } from "lucide-react";
import { BudgetSpentChart, TaskStatusChart } from "./charts";

const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0);
const budgetUtilization = (totalSpent / totalBudget) * 100;
const onTrackProjects = projects.filter(p => p.status === 'On Track').length;
const onTrackPercentage = (onTrackProjects / projects.length) * 100;

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-8">
       <div>
        <h1 className="text-3xl font-bold font-headline">Reports & Analytics</h1>
        <p className="text-muted-foreground">
          Analyze project performance and financial data.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget vs Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toLocaleString()} / ${totalBudget.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {budgetUtilization.toFixed(2)}% of total budget utilized
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects On Track</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{onTrackProjects} / {projects.length}</div>
            <p className="text-xs text-muted-foreground">
              {onTrackPercentage.toFixed(0)}% of all projects are on schedule
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Project Progress</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ (projects.reduce((acc, p) => acc + p.progress, 0) / projects.length).toFixed(0) }%</div>
            <p className="text-xs text-muted-foreground">
                Average completion across all projects
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Budget vs. Spent Analysis</CardTitle>
            <CardDescription>
              A comparison of budgeted vs. actual spending for each project.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BudgetSpentChart />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Task Status Distribution</CardTitle>
            <CardDescription>
              The breakdown of all tasks by their current status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TaskStatusChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

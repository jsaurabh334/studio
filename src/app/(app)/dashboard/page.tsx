
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Briefcase,
  CircleDollarSign,
  TrendingUp,
  Users,
  Activity,
} from "lucide-react";
import { projects, recentActivities, contractors } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import dynamic from 'next/dynamic';

const ProjectProgressChart = dynamic(() => import('./charts').then(mod => mod.ProjectProgressChart), {
  ssr: false,
  loading: () => <div className="h-[350px] w-full flex items-center justify-center"><p>Loading chart...</p></div>,
});


const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0);
const overallProgress =
  projects.reduce((sum, p) => sum + p.progress, 0) / projects.length;
const activeContractors = contractors.filter(c => c.status === 'Active').length;


export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's a summary of your projects.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Projects</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">
              {projects.filter((p) => p.status !== "Completed").length} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>
              Budget vs. Actual
            </CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(totalSpent / 1000000).toFixed(2)}M
            </div>
            <p className="text-xs text-muted-foreground">
              of ${(totalBudget / 1000000).toFixed(2)}M budget
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>
              Overall Progress
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallProgress.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">
              Across all active projects
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>
              Active Contractors
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{activeContractors}</div>
            <p className="text-xs text-muted-foreground">
              Working on current projects
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Project Progress Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ProjectProgressChart />
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              What's been happening across your projects.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-semibold">{activity.user}</span>{" "}
                      {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
                <CardTitle>Active Projects</CardTitle>
                <CardDescription>
                    An overview of projects currently in progress.
                </CardDescription>
            </div>
            <Link href="/projects" className={cn(buttonVariants({ variant: "outline" }), "ml-auto gap-1")}>
                View All
                <ArrowRight className="h-4 w-4" />
            </Link>
        </CardHeader>
        <CardContent>
        <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead className="w-[250px]">Progress</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">Budget</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.filter(p => p.status !== 'Completed').map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <div className="font-medium">{project.name}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {project.id}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <Progress value={project.progress} className="h-2" />
                        <span className="text-muted-foreground text-sm">{project.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant={project.status === 'On Track' ? 'secondary' : 'outline'} className={project.status === 'On Track' ? "bg-accent/80 text-accent-foreground" : "border-yellow-500/50 text-yellow-500"}>
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    ${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Link href={`/projects/${project.id}`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
                        View
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

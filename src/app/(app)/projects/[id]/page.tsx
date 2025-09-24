
import { notFound } from "next/navigation";
import { projects } from "@/lib/data";
import { ProjectHeader } from "./project-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDollarSign, TrendingUp, Users } from "lucide-react";
import { TaskGanttChart } from "./task-gantt-chart";
import { ProjectSummary } from "./project-summary";

export default function ProjectDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const project = projects.find((p) => p.id === params.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      <ProjectHeader project={project} />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Budget vs. Actual
            </CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(project.spent / 1000000).toFixed(2)}M
            </div>
            <p className="text-xs text-muted-foreground">
              of ${(project.budget / 1000000).toFixed(2)}M budget
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Project Progress
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.progress.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">
              Overall project completion
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Assigned Contractors
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{project.assignedContractors.length}</div>
            <p className="text-xs text-muted-foreground">
              Working on this project
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <TaskGanttChart tasks={project.tasks} />
        </div>
        <div className="lg:col-span-1 flex flex-col gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>About Project</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                </CardContent>
            </Card>
            <ProjectSummary project={project} />
        </div>
      </div>
    </div>
  );
}

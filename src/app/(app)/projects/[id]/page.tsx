
import { notFound } from "next/navigation";
import { contractors, projects } from "@/lib/data";
import { ProjectHeader } from "./project-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDollarSign, TrendingUp, Users } from "lucide-react";
import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";

const TaskGanttChart = dynamic(() => import("./task-gantt-chart").then(mod => mod.TaskGanttChart), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full flex items-center justify-center"><p>Loading chart...</p></div>,
});

const ProjectSummary = dynamic(() => import("./project-summary").then(mod => mod.ProjectSummary), {
  ssr: false,
  loading: () => <div className="h-[200px] w-full flex items-center justify-center"><p>Loading summary...</p></div>,
});

export default function ProjectDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const project = projects.find((p) => p.id === params.id);

  if (!project) {
    notFound();
  }

  const assignedContractorDetails = project.assignedContractors.map(id => 
    contractors.find(c => c.id === id)
  ).filter(Boolean); // Filter out any undefined if a contractor ID is invalid

  return (
    <div className="flex flex-col gap-8">
      <ProjectHeader project={project} />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>
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
            <CardTitle>
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
            <CardTitle>
              Assigned Contractors
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{project.assignedContractors.length}</div>
            <div className="text-xs text-muted-foreground flex flex-wrap gap-1 mt-1">
                {assignedContractorDetails.map(c => c && (
                    <Badge key={c.id} variant="secondary">{c.name}</Badge>
                ))}
            </div>
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

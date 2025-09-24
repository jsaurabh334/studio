
"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Project } from "@/lib/data";

const TaskGanttChart = dynamic(() => import("./task-gantt-chart").then(mod => mod.TaskGanttChart), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full flex items-center justify-center"><p>Loading chart...</p></div>,
});

const ProjectSummary = dynamic(() => import("./project-summary").then(mod => mod.ProjectSummary), {
  ssr: false,
  loading: () => <div className="h-[200px] w-full flex items-center justify-center"><p>Loading summary...</p></div>,
});

export function ProjectDetailsClientLayout({ project }: { project: Project }) {
  return (
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
  );
}

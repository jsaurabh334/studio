
"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Project } from "@/lib/data";
import { ProjectSummary } from "./project-summary";
import { ExpenseTracker } from "./expense-tracker";

const TaskGanttChart = dynamic(() => import("./task-gantt-chart").then(mod => mod.TaskGanttChart), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full flex items-center justify-center"><p>Loading chart...</p></div>,
});

export function ProjectDetailsClientLayout({ project }: { project: Project }) {
  return (
    <>
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
        <ExpenseTracker project={project} />
    </>
  );
}

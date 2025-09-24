"use client";

import type { Project } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function ProjectHeader({ project }: { project: Project }) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold font-headline">{project.name}</h1>
            <Badge
              variant={project.status === 'On Track' ? 'secondary' : project.status === 'Completed' ? 'default' : 'outline'}
              className={
                project.status === 'On Track' ? "bg-accent/80 text-accent-foreground" 
                : project.status === 'Delayed' ? "border-yellow-500/50 text-yellow-500" 
                : "bg-primary/20 text-primary-foreground"
              }
            >
              {project.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">Project ID: {project.id}</p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" /> Edit Project
            </Button>
            <Button variant="destructive"
              disabled={project.status !== 'Completed'}
            >
                <Trash2 className="mr-2 h-4 w-4" /> Delete Project
            </Button>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-muted-foreground">Overall Progress</span>
            <span className="text-sm font-semibold">{project.progress}%</span>
        </div>
        <Progress value={project.progress} className="w-full" />
      </div>
    </div>
  );
}

    
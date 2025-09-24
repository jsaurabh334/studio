
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import type { Project } from "@/lib/data";

async function getProjects(): Promise<Project[]> {
  // In a real app, this would be an API call.
  // For now, we connect to the DB directly in this server component
  // This is a temporary step until we build out the full API
  try {
     const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/projects`, { cache: 'no-store' });
     if (!res.ok) {
       console.error("Failed to fetch projects");
       return [];
     }
     const data = await res.json();
     return data.projects || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}


export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Projects</h1>
          <p className="text-muted-foreground">
            Browse and manage all of your projects.
          </p>
        </div>
        <Button asChild>
          <Link href="/projects/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Project
          </Link>
        </Button>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead className="w-[250px]">Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Budget</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects && projects.length > 0 ? projects.map((project) => (
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
                  <TableCell>
                    <Badge variant={project.status === 'On Track' ? 'secondary' : project.status === 'Completed' ? 'default' : 'outline'} className={
                        project.status === 'On Track' ? "bg-accent/80 text-accent-foreground" 
                        : project.status === 'Delayed' ? "border-yellow-500/50 text-yellow-500" 
                        : "bg-primary/20 text-primary-foreground"}>
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    ${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Link href={`/projects/${project.id}`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
                        View Details
                    </Link>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No projects found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

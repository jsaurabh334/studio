import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { projects } from "@/lib/data";
import { Progress } from "@/components/ui/progress";

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Projects</h1>
          <p className="text-muted-foreground">
            Browse and manage all of your projects.
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Project
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
              {projects.map((project) => (
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

    
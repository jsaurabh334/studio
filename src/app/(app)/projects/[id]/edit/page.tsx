import { notFound } from "next/navigation";
import { ProjectForm } from "@/app/(app)/projects/project-form";
import { projects } from "@/lib/data";

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const project = projects.find((p) => p.id === params.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Edit Project</h1>
        <p className="text-muted-foreground">
          Update the details for "{project.name}".
        </p>
      </div>
      <ProjectForm project={project} />
    </div>
  );
}

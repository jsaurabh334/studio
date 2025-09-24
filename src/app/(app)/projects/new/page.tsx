import { ProjectForm } from "../project-form";

export default function NewProjectPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Create a New Project</h1>
        <p className="text-muted-foreground">
          Fill out the form below to get started.
        </p>
      </div>
      <ProjectForm />
    </div>
  );
}

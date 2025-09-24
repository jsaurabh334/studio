
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import type { Project } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { contractors } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

const ProjectFormSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  budget: z.coerce.number().min(1000, "Budget must be at least $1,000."),
  assignedContractors: z.array(z.string()).default([]),
});

type ProjectFormValues = z.infer<typeof ProjectFormSchema>;

export function ProjectForm({ project }: { project?: Project }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(ProjectFormSchema),
    defaultValues: {
      name: project?.name || "",
      description: project?.description || "",
      budget: project?.budget || 0,
      assignedContractors: project?.assignedContractors || [],
    },
  });

  async function onSubmit(values: ProjectFormValues) {
    setIsLoading(true);
    // In a real app, you'd make an API call here.
    // To simulate, we'll just show a success message and redirect.
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("Submitted values:", values);
    toast({
        title: project ? "Project Updated!" : "Project Created!",
        description: `The project "${values.name}" has been successfully saved.`,
    })
    setIsLoading(false);
    
    // We can't actually modify the mock data, so we just navigate back.
    // In a real app, you'd revalidate the path or redirect to the new project page.
    router.push("/projects");
    router.refresh(); // Tells Next.js to refetch server components
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>{project ? "Edit Project" : "New Project Details"}</CardTitle>
            <CardDescription>
              {project ? "Update the details of your project." : "Please provide the following information to create your new project."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Downtown High-Rise" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., A 40-story commercial office building..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a brief overview of the project.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Budget</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 5000000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="assignedContractors"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Assign Contractors</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value?.length && "text-muted-foreground"
                          )}
                        >
                           <div className="flex gap-1 flex-wrap">
                            {field.value?.length > 0 ? field.value.map(contractorId => (
                                <Badge variant="secondary" key={contractorId}>
                                    {contractors.find(c => c.id === contractorId)?.name}
                                </Badge>
                            )) : "Select contractors"}
                           </div>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandInput placeholder="Search contractors..." />
                        <CommandList>
                            <CommandEmpty>No contractors found.</CommandEmpty>
                            <CommandGroup>
                            {contractors.map((contractor) => (
                                <CommandItem
                                key={contractor.id}
                                value={contractor.name}
                                onSelect={() => {
                                    const selected = field.value || [];
                                    const newSelection = selected.includes(contractor.id)
                                    ? selected.filter((id) => id !== contractor.id)
                                    : [...selected, contractor.id];
                                    field.onChange(newSelection);
                                }}
                                >
                                <Check
                                    className={cn(
                                    "mr-2 h-4 w-4",
                                    (field.value || []).includes(contractor.id)
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                />
                                {contractor.name}
                                </CommandItem>
                            ))}
                            </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Select one or more contractors to assign to this project.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Saving..." : project ? "Save Changes" : "Create Project"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

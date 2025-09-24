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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import type { Contractor } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ContractorFormSchema = z.object({
  name: z.string().min(2, "Contractor name must be at least 2 characters."),
  company: z.string().min(2, "Company name must be at least 2 characters."),
  status: z.enum(["Active", "Inactive"]),
});

type ContractorFormValues = z.infer<typeof ContractorFormSchema>;

export function ContractorForm({ contractor }: { contractor?: Contractor }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<ContractorFormValues>({
    resolver: zodResolver(ContractorFormSchema),
    defaultValues: {
      name: contractor?.name || "",
      company: contractor?.company || "",
      status: contractor?.status || "Active",
    },
  });

  async function onSubmit(values: ContractorFormValues) {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
        title: contractor ? "Contractor Updated!" : "Contractor Added!",
        description: `The contractor "${values.name}" has been successfully saved.`,
    })
    setIsLoading(false);
    
    router.push("/contractors");
    router.refresh();
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>{contractor ? "Edit Contractor" : "New Contractor Details"}</CardTitle>
            <CardDescription>
              {contractor ? "Update the details of the contractor." : "Please provide the following information to add a new contractor."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contractor Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., BuildRight Inc."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Saving..." : contractor ? "Save Changes" : "Add Contractor"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

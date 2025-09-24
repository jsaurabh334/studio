"use client";

import { useState } from "react";
import { summarizeProject } from "@/ai/flows/summarize-project-flow";
import type { Project } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function ProjectSummary({ project }: { project: Project }) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerateSummary() {
    setIsLoading(true);
    setError(null);
    setSummary(null);

    try {
      const result = await summarizeProject({
        name: project.name,
        description: project.description,
        progress: project.progress,
        budget: project.budget,
        spent: project.spent,
        status: project.status,
        tasks: project.tasks,
      });
      setSummary(result.summary);
    } catch (e) {
      console.error(e);
      setError("Failed to generate summary. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Project Summary
        </CardTitle>
        <CardDescription>
          Get an AI-generated overview of this project's status and health.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {summary && (
            <div className="prose prose-sm dark:prose-invert text-sm text-muted-foreground whitespace-pre-wrap">
                {summary}
            </div>
        )}
        
        {isLoading && (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!summary && !isLoading && (
          <Button onClick={handleGenerateSummary} className="w-full">
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Summary
          </Button>
        )}

        {summary && !isLoading &&(
             <Button onClick={handleGenerateSummary} variant="outline" size="sm" className="w-full">
                <Sparkles className="mr-2 h-4 w-4" />
                Regenerate
            </Button>
        )}
      </CardContent>
    </Card>
  );
}

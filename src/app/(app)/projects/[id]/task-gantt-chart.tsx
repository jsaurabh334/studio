
"use client";

import { useState } from "react";
import type { Task } from "@/lib/data";
import { generateTasksForGoal } from "@/ai/flows/generate-tasks-flow";
import { addDays, differenceInDays, format, parseISO } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const statusColors: Record<Task['status'], string> = {
  "To Do": "hsl(var(--chart-3))",
  "In Progress": "hsl(var(--chart-2))",
  "Done": "hsl(var(--chart-1))",
};

// Helper to prepare data for the chart
const prepareChartData = (tasks: Task[]) => {
  if (tasks.length === 0) return [];
  const sortedTasks = [...tasks].sort((a, b) => parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime());
  const projectStartDate = parseISO(sortedTasks[0].dueDate);

  return sortedTasks.map(task => {
    const startDate = parseISO(task.dueDate);
    // Assuming a fixed duration for visualization purposes
    const duration = 10; 
    const endDate = addDays(startDate, duration);
    
    const startDay = differenceInDays(startDate, projectStartDate);
    const endDay = differenceInDays(endDate, projectStartDate);

    return {
      name: task.title,
      range: [startDay, endDay],
      status: task.status,
    };
  });
};

export function TaskGanttChart({ tasks: initialTasks }: { tasks: Task[] }) {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [isGenerating, setIsGenerating] = useState(false);
    const [goal, setGoal] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();

    const chartData = prepareChartData(tasks);

    async function handleGenerateTasks() {
        if (!goal) return;
        setIsGenerating(true);
        try {
        const result = await generateTasksForGoal({ goal });
        const newTasks: Task[] = result.tasks.map(t => ({
            id: `TASK-${Math.floor(Math.random() * 10000)}`,
            title: t.title,
            status: 'To Do' as const,
            dueDate: new Date().toISOString().split('T')[0],
        }));
        setTasks(prev => [...newTasks, ...prev]);
        toast({
            title: "Tasks Generated!",
            description: `${newTasks.length} new tasks have been added to your project.`,
        });
        setIsDialogOpen(false);
        setGoal("");
        } catch (error) {
        console.error(error);
        toast({
            variant: "destructive",
            title: "Generation Failed",
            description: "There was an error generating tasks from your goal.",
        });
        } finally {
        setIsGenerating(false);
        }
    }

    function handleAddTask() {
        const newTask: Task = {
        id: `TASK-${Math.floor(Math.random() * 1000) + 400}`,
        title: "New Task - Click to Edit",
        status: "To Do",
        dueDate: new Date().toISOString().split("T")[0],
        };
        setTasks([newTask, ...tasks]);
        toast({ title: "Task Added", description: "A new task has been added to the project." });
    }

  return (
    <Card>
      <CardHeader  className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Task Schedule</CardTitle>
            <CardDescription>A Gantt chart view of the project tasks.</CardDescription>
        </div>
         <div className="flex gap-2">
           <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Sparkles className="mr-2 h-4 w-4" />
                Generate with AI
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Generate Tasks</DialogTitle>
                <DialogDescription>
                  Describe a high-level goal, and AI will create the tasks for you.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="goal" className="text-right">
                    Goal
                  </Label>
                  <Input
                    id="goal"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="e.g., 'Lay the building foundation'"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleGenerateTasks} disabled={isGenerating}>
                  {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  {isGenerating ? 'Generating...' : 'Generate'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm" onClick={handleAddTask}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Task
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[400px] w-full">
            <ResponsiveContainer>
              {tasks.length > 0 ? (
                <BarChart
                    layout="vertical"
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    barCategoryGap="20%"
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" domain={['dataMin', 'dataMax + 2']} unit=" days" />
                    <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} interval={0} />
                    <Tooltip
                        content={<ChartTooltipContent />}
                        cursor={{fill: 'hsl(var(--muted))'}}
                    />
                    <Bar dataKey="range" minPointSize={5}>
                        <LabelList dataKey="name" position="insideLeft" style={{ fill: 'white' }} fontSize={12} />
                        {chartData.map((entry) => (
                            <Cell key={`cell-${entry.name}`} fill={statusColors[entry.status as keyof typeof statusColors]} />
                        ))}
                    </Bar>
                </BarChart>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                    No tasks yet. Add a task to see the chart.
                </div>
              )}
            </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}


"use client";

import { useState } from "react";
import type { Task } from "@/lib/data";
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
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const statusColors = {
  "To Do": "bg-gray-500/20 text-gray-400",
  "In Progress": "bg-blue-500/20 text-blue-400",
  "Done": "bg-green-500/20 text-green-400",
};

export function TaskList({ tasks: initialTasks }: { tasks: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const { toast } = useToast();

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

  function handleToggleComplete(taskId: string) {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const newStatus = task.status === "Done" ? "In Progress" : "Done";
          toast({ title: `Task status updated to "${newStatus}"` });
          return { ...task, status: newStatus };
        }
        return task;
      })
    );
  }

  function handleDeleteTask(taskId: string) {
    const taskToDelete = tasks.find(t => t.id === taskId);
    setTasks(tasks.filter((task) => task.id !== taskId));
    toast({ title: "Task Deleted", description: `Task "${taskToDelete?.title}" has been removed.` });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>Manage the tasks for this project.</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={handleAddTask}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Task
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <span className="sr-only">Status</span>
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <Checkbox
                    checked={task.status === "Done"}
                    onCheckedChange={() => handleToggleComplete(task.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>{task.dueDate}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusColors[task.status]}>
                    {task.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem disabled>Edit Task</DropdownMenuItem>
                      <DropdownMenuItem disabled>Change Status</DropdownMenuItem>
                       <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                Delete Task
                           </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the task "{task.title}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteTask(task.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

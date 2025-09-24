
"use client";

import { useState, useMemo } from "react";
import type { Project, Expense } from "@/lib/data";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Loader2 } from "lucide-react";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';

const ExpenseFormSchema = z.object({
  description: z.string().min(3, "Description is too short."),
  amount: z.coerce.number().min(0.01, "Amount must be positive."),
  category: z.enum(["Materials", "Labor", "Permits", "Equipment", "Other"]),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
});

type ExpenseFormValues = z.infer<typeof ExpenseFormSchema>;

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function ExpenseTracker({ project }: { project: Project }) {
  const [expenses, setExpenses] = useState<Expense[]>(project.expenses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(ExpenseFormSchema),
    defaultValues: {
      description: "",
      amount: 0,
      category: "Materials",
      date: format(new Date(), 'yyyy-MM-dd'),
    },
  });

  const expenseByCategory = useMemo(() => {
    return expenses.reduce((acc, expense) => {
      const category = expense.category;
      if (!acc[category]) {
        acc[category] = { name: category, value: 0 };
      }
      acc[category].value += expense.amount;
      return acc;
    }, {} as Record<string, { name: string; value: number }>);
  }, [expenses]);

  const chartData = Object.values(expenseByCategory);
  const chartConfig = useMemo(() => {
    return chartData.reduce((acc, data, index) => {
      acc[data.name] = { label: data.name, color: COLORS[index % COLORS.length] };
      return acc;
    }, {} as any)
  }, [chartData]);

  async function onSubmit(values: ExpenseFormValues) {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    
    const newExpense: Expense = {
      id: `EXP-${Math.random().toString(36).substr(2, 9)}`,
      ...values
    };
    setExpenses(prev => [...prev, newExpense]);

    toast({
      title: "Expense Added",
      description: `Successfully logged a new expense of $${values.amount}.`,
    });

    setIsLoading(false);
    setIsDialogOpen(false);
    form.reset();
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Expense Tracker</CardTitle>
          <CardDescription>
            A breakdown of costs for {project.name}.
          </CardDescription>
        </div>
         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              Log Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log a New Expense</DialogTitle>
              <DialogDescription>
                Fill out the details below to add a new expense entry for this project.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Cement delivery" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 1500" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                         <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Materials">Materials</SelectItem>
                          <SelectItem value="Labor">Labor</SelectItem>
                          <SelectItem value="Permits">Permits</SelectItem>
                          <SelectItem value="Equipment">Equipment</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add Expense
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex flex-col">
            <h4 className="text-center font-semibold mb-4">Expense by Category</h4>
             <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Tooltip content={<ChartTooltipContent hideLabel />} />
                        <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false}>
                             {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </ChartContainer>
          </div>
          <div>
             <h4 className="font-semibold mb-4">Expense Log</h4>
             <div className="h-[300px] overflow-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {expenses.length > 0 ? expenses.map(expense => (
                        <TableRow key={expense.id}>
                            <TableCell>
                                <div className="font-medium">{expense.description}</div>
                                <div className="text-xs text-muted-foreground">{format(new Date(expense.date), 'PPP')}</div>
                            </TableCell>
                            <TableCell>{expense.category}</TableCell>
                            <TableCell className="text-right">${expense.amount.toLocaleString()}</TableCell>
                        </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center h-24">No expenses logged yet.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
             </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

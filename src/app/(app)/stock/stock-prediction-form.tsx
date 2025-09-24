"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  predictStockDepletion,
  PredictStockDepletionInput,
  PredictStockDepletionOutput,
} from "@/ai/flows/stock-level-prediction";
import { z } from "genkit";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CalendarClock, ShoppingCart, BellRing } from "lucide-react";

const PredictStockDepletionInputSchema = z.object({
  materialName: z.string().min(2, "Material name is required."),
  initialStockLevel: z.coerce
    .number()
    .min(1, "Stock level must be at least 1."),
  dailyUsageRate: z.coerce
    .number()
    .min(0.1, "Usage rate must be greater than 0."),
  leadTimeDays: z.coerce
    .number()
    .min(0, "Lead time cannot be negative."),
  projectId: z.string().min(1, "Project ID is required."),
});

export default function StockPredictionForm() {
  const [prediction, setPrediction] =
    useState<PredictStockDepletionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<PredictStockDepletionInput>({
    resolver: zodResolver(PredictStockDepletionInputSchema),
    defaultValues: {
      materialName: "",
      initialStockLevel: 1000,
      dailyUsageRate: 50,
      leadTimeDays: 7,
      projectId: "PROJ-001",
    },
  });

  async function onSubmit(values: PredictStockDepletionInput) {
    setIsLoading(true);
    setError(null);
    setPrediction(null);
    try {
      const result = await predictStockDepletion(values);
      setPrediction(result);
    } catch (e) {
      setError("Failed to get prediction. Please try again.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Prediction Tool</CardTitle>
            <CardDescription>
              Fill in the details below to get a stock prediction.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                control={form.control}
                name="materialName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Material Name</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Cement Bags" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Project ID</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., PROJ-001" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="initialStockLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Stock Level</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dailyUsageRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daily Usage Rate</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="leadTimeDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lead Time (Days)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {prediction && (
              <div className="space-y-4 pt-4">
                <h3 className="font-semibold text-lg">Prediction Result:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-secondary/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Predicted Depletion Date</CardTitle>
                            <CalendarClock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{prediction.predictedDepletionDate}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-secondary/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Recommended Reorder Quantity</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{prediction.reorderQuantity} units</div>
                        </CardContent>
                    </Card>
                </div>
                <Alert className="border-accent bg-accent/10 text-accent-foreground">
                    <BellRing className="h-5 w-5 !text-accent" />
                  <AlertTitle className="font-bold">Reorder Alert!</AlertTitle>
                  <AlertDescription>
                    {prediction.reorderAlert}
                  </AlertDescription>
                </Alert>
              </div>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Analyzing..." : "Predict Depletion"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

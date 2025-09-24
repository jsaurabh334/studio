import StockPredictionForm from "./stock-prediction-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PackageSearch } from "lucide-react";

export default function StockPredictionPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Stock Level Prediction</h1>
        <p className="text-muted-foreground">
          Use AI to predict stock depletion and get reorder alerts.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <StockPredictionForm />
        </div>
        <div className="lg:col-span-1">
            <Card className="h-full">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <PackageSearch className="h-8 w-8 text-primary" />
                        <div>
                            <CardTitle>How it works</CardTitle>
                            <CardDescription>Our AI analyzes your inputs.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-4">
                    <p>
                        Provide the current stock level, average daily usage, and the supplier's lead time for a specific material.
                    </p>
                    <p>
                        Our AI model will calculate the estimated date your stock will run out and recommend an optimal reorder quantity and date to prevent project delays.
                    </p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

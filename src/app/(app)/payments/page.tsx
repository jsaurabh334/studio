import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { payments } from "@/lib/data";
import { CircleDollarSign, Landmark, Package } from "lucide-react";
import { PaymentChart } from "./payment-chart";

const totalPaid = payments
  .filter((p) => p.status === "Paid")
  .reduce((sum, p) => sum + p.amount, 0);
const totalPending = payments
  .filter((p) => p.status === "Pending")
  .reduce((sum, p) => sum + p.amount, 0);

export default function PaymentsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Payments</h1>
        <p className="text-muted-foreground">
          Track and manage all project-related payments.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalPaid.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">in completed payments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Outstanding
            </CardTitle>
            <Landmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalPending.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">in pending payments</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>
              Payments made over the last 6 months.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PaymentChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Payment Log</CardTitle>
            <CardDescription>
              A log of all recent payments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.slice(0, 5).map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div className="font-medium">{payment.projectName}</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        {payment.contractorName}
                      </div>
                    </TableCell>
                    <TableCell>${payment.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          payment.status === "Paid" ? "secondary" : "outline"
                        }
                        className={payment.status === "Paid" ? "bg-accent/80 text-accent-foreground" : "border-yellow-500/50 text-yellow-500"}
                      >
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{payment.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

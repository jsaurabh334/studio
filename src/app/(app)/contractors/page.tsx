import Image from "next/image";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { contractors } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ContractorActions } from "./contractor-actions";

export default function ContractorsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold font-headline">Contractors</h1>
                <p className="text-muted-foreground">
                Manage your contractors and their profiles.
                </p>
            </div>
            <Button asChild>
              <Link href="/contractors/new">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Contractor
              </Link>
            </Button>
        </div>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Projects</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contractors.map((contractor) => {
                const avatar = PlaceHolderImages.find(
                  (img) => img.id === contractor.avatar
                );
                return (
                  <TableRow key={contractor.id}>
                    <TableCell className="hidden sm:table-cell">
                      {avatar && (
                        <Image
                          alt={contractor.name}
                          className="aspect-square rounded-full object-cover"
                          height="64"
                          src={avatar.imageUrl}
                          width="64"
                          data-ai-hint={avatar.imageHint}
                        />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {contractor.name}
                    </TableCell>
                    <TableCell>{contractor.company}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          contractor.status === "Active"
                            ? "secondary"
                            : "outline"
                        }
                        className={contractor.status === "Active" ? "bg-accent/80 text-accent-foreground" : ""}
                      >
                        {contractor.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{contractor.projectCount}</TableCell>
                    <TableCell>
                      <ContractorActions />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

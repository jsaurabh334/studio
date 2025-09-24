import { notFound } from "next/navigation";
import { ContractorForm } from "@/app/(app)/contractors/contractor-form";
import { contractors } from "@/lib/data";

export default function EditContractorPage({ params }: { params: { id: string } }) {
  const contractor = contractors.find((c) => c.id === params.id);

  if (!contractor) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Edit Contractor</h1>
        <p className="text-muted-foreground">
          Update the profile for "{contractor.name}".
        </p>
      </div>
      <ContractorForm contractor={contractor} />
    </div>
  );
}

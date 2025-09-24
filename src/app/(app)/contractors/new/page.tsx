import { ContractorForm } from "../contractor-form";

export default function NewContractorPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Create a New Contractor</h1>
        <p className="text-muted-foreground">
          Fill out the form below to add a new contractor to your roster.
        </p>
      </div>
      <ContractorForm />
    </div>
  );
}

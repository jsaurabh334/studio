import { SettingsForm } from "./settings-form";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application settings.
        </p>
      </div>
      <div className="max-w-2xl">
        <SettingsForm />
      </div>
    </div>
  );
}

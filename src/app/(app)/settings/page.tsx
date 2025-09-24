import { SettingsForm } from "./settings-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lock } from "lucide-react";


// In a real app, this would come from a user session.
// We'll simulate it here.
const currentUser = {
  name: "Admin User",
  email: "admin@example.com",
  role: "Admin",
};

export default function SettingsPage() {
    if (currentUser.role !== 'Admin') {
        return (
             <div className="flex flex-col gap-8">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Settings</h1>
                    <p className="text-muted-foreground">
                        Manage your account and application settings.
                    </p>
                </div>
                 <Alert variant="destructive">
                    <Lock className="h-4 w-4" />
                    <AlertTitle>Access Denied</AlertTitle>
                    <AlertDescription>
                        You do not have permission to view this page. Please contact an administrator.
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application settings.
        </p>
      </div>
      <div className="max-w-2xl">
        <SettingsForm user={currentUser} />
      </div>
    </div>
  );
}

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/logo";

export function AuthCard({ children }: { children: React.ReactNode }) {
    return (
        <Card>
            <div className="flex flex-col items-center justify-center p-6 pb-2">
                <Logo className="h-10 w-10 text-primary mb-2" />
                <h1 className="text-2xl font-bold font-headline">CivilSage</h1>
            </div>
            {children}
        </Card>
    );
}

export const AuthCardHeader = CardHeader;
export const AuthCardTitle = CardTitle;
export const AuthCardDescription = CardDescription;
export const AuthCardContent = CardContent;
export const AuthCardFooter = CardFooter;

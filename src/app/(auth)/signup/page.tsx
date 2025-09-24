"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { AuthCard, AuthCardContent, AuthCardHeader, AuthCardTitle, AuthCardDescription, AuthCardFooter } from "../auth-card";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const SignupFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type SignupFormValues = z.infer<typeof SignupFormSchema>;

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignupFormValues) {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Something went wrong');
      }
      
      toast({
          title: "Account Created!",
          description: "You have been successfully signed up. Please log in.",
      });
      
      router.push("/login");

    } catch (e: any) {
        setError(e.message);
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <AuthCard>
      <AuthCardHeader>
        <AuthCardTitle>Create an Account</AuthCardTitle>
        <AuthCardDescription>
          Get started with CivilSage today.
        </AuthCardDescription>
      </AuthCardHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <AuthCardContent className="space-y-4">
                {error && (
                    <Alert variant="destructive">
                        <AlertTitle>Signup Failed</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                        <Input type="email" placeholder="name@company.com" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                </AuthCardContent>
                <AuthCardFooter className="flex-col gap-4">
                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/login" className="font-semibold text-primary hover:underline">
                            Sign In
                        </Link>
                    </p>
                </AuthCardFooter>
            </form>
        </Form>
    </AuthCard>
  );
}

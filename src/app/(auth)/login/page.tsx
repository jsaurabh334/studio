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

const LoginFormSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type LoginFormValues = z.infer<typeof LoginFormSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      toast({
          title: "Login Successful!",
          description: "Welcome back!",
      });
      
      router.push("/dashboard");

    } catch (e: any) {
        setError(e.message);
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <AuthCard>
      <AuthCardHeader>
        <AuthCardTitle>Welcome Back!</AuthCardTitle>
        <AuthCardDescription>
          Sign in to your CivilSage account to continue.
        </AuthCardDescription>
      </AuthCardHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <AuthCardContent className="space-y-4">
                {error && (
                    <Alert variant="destructive">
                        <AlertTitle>Login Failed</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
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
                        {isLoading ? "Signing In..." : "Sign In"}
                    </Button>
                    <p className="text-center text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <Link href="/signup" className="font-semibold text-primary hover:underline">
                            Sign up
                        </Link>
                    </p>
                </AuthCardFooter>
            </form>
        </Form>
    </AuthCard>
  );
}

"use client";

import { protectAuthActions } from "@/actions/protectAuthActions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast";
import { useAuthStore } from "@/store/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { registerSchema, RegisterValues } from "../../../validators/authSchema";

const RegisterForm = () => {

    const { error, register } = useAuthStore();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<RegisterValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: RegisterValues) => {
        setIsLoading(true);

        const checkFirstLevelOfValidation = await protectAuthActions(values.email);

        if (!checkFirstLevelOfValidation?.success) {
            showErrorToast("Validation Error", checkFirstLevelOfValidation?.message || "Unknown error");
            setIsLoading(false);
            return;
        }

        const userId = await register({ name: values.name, email: values.email, password: values.password });

        if (userId) {
            showSuccessToast("Success", "Account created successfully! Please login to continue.");
            form.reset();
            router.push("/login");
        }
        else if (error) {
            showErrorToast("Registration Failed", error);
        }

        setIsLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">

            <Card className="w-full max-w-5xl overflow-hidden p-10">

                <div className="grid grid-cols-1 md:grid-cols-2">

                    <div className="relative flex flex-col items-center justify-center gap-6 bg-muted/50 p-10">
                        <Image
                            src="/logo.svg"
                            alt="Company Logo"
                            height={220}
                            width={220}
                            priority
                        />

                        <div className="text-center">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Create your account
                            </h1>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Join the admin dashboard to manage everything in one place.
                            </p>
                        </div>

                    </div>

                    <div className="p-8 md:p-10">
                        <h2 className="mb-6 text-xl font-semibold tracking-tight">
                            Register
                        </h2>

                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-5"
                                noValidate
                            >
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="John Doe"
                                                    autoComplete="name"
                                                    disabled={isLoading}
                                                    {...field}
                                                />
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
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="you@example.com"
                                                    autoComplete="email"
                                                    disabled={isLoading}
                                                    {...field}
                                                />
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
                                                <Input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    autoComplete="new-password"
                                                    disabled={isLoading}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Creating account..." : "Create account"}
                                </Button>
                            </form>
                        </Form>

                        <div className="mt-6 text-center text-sm">
                            <span className="text-muted-foreground">Already have an account? </span>
                            <Link
                                href="/login"
                                className="font-medium text-primary hover:underline"
                            >
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default RegisterForm;
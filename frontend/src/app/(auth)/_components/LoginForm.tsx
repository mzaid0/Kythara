"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { loginSchema, LoginValues } from "../../../validators/authSchema";
import { protectAuthActions } from "@/actions/protectAuthActions";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LoginForm = () => {

    const [isLoading, setIsLoading] = useState(false);
    const { error, login } = useAuthStore()
    const router = useRouter()


    const form = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onSubmit",
    });

    const onSubmit = async (values: LoginValues) => {
        setIsLoading(true);

        const checkFirstLevelOfValidation = await protectAuthActions(values.email);

        if (!checkFirstLevelOfValidation?.success) {
            showErrorToast("Validation Error", checkFirstLevelOfValidation?.message || "Unknown error");
            setIsLoading(false);
            return;
        }

        const success = await login({ email: values.email, password: values.password })

        if (success) {

            const user = useAuthStore.getState().user

            if (user?.role === "USER") {
                showSuccessToast("Success", "Login successfully! Welcome to Kythara");
                router.push("/")
            }
            else {
                showSuccessToast("Success", "Login successfully! Welcome to your Dashboard");
                router.push("/admin")
            }
        }

        else if (error) {
            showErrorToast("Login Failed", error);

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
                            alt="logo"
                            height={220}
                            width={220}
                            priority
                        />

                        <div className="text-center">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Welcome back
                            </h1>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Sign in to access your admin dashboard and manage everything in
                                one place.
                            </p>
                        </div>

                    </div>

                    <div className="p-8 md:p-10">
                        <h2 className="mb-6 text-xl font-semibold tracking-tight">
                            Login
                        </h2>

                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-5"
                                noValidate
                            >
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
                                                    autoComplete="current-password"
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
                                    {isLoading ? "Signing in..." : "Sign in"}
                                </Button>
                            </form>
                        </Form>
                        <div className="mt-6 text-center text-sm">
                            <span className="text-muted-foreground">Don&apos;t have an account? </span>
                            <Link
                                href="/register"
                                className="font-medium text-primary hover:underline"
                            >
                                Register
                            </Link>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default LoginForm;

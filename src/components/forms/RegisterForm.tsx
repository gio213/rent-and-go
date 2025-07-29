"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Eye, EyeOff, Mail, Lock, LogIn, UserPlus } from "lucide-react";
import {
  UserRegisterSchema,
  UserRegisterSchemaType,
} from "@/validation/auth-validation";
import Link from "next/link";
import { register_user } from "@/actions/user.actions";
import { toast } from "sonner";
import { useLocale } from "next-intl";

const RegisterForm = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const locale = useLocale();

  const form = useForm<UserRegisterSchemaType>({
    resolver: zodResolver(UserRegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      lastName: "",
    },
  });
  const onSubmit = async (data: UserRegisterSchemaType) => {
    const registerPromise = register_user(data);

    toast.promise(registerPromise, {
      loading: "Registering...",
      success: (result) => {
        form.reset();
        return result.message;
      },
      error: (error) => {
        return error.message;
      },
      position: "top-right",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <UserPlus className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Create an Account</h1>
          <p>Fill in the form to get started</p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl shadow-xl border p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your first name"
                        className="h-12 rounded-lg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />

              {/* Last Name */}
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your last name"
                        className="h-12 rounded-lg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">
                      Email
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                        <Input
                          placeholder="you@example.com"
                          className="pl-11 h-12 rounded-lg"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          className="pl-11 pr-11 h-12 rounded-lg"
                          {...field}
                        />
                        <Button
                          variant={"link"}
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-12 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Register
              </Button>
            </form>
          </Form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs">
          Already have an account?{" "}
          <Link
            href={`/${locale}/auth/login`}
            className="underline font-medium"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;

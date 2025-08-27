"use client";
import { LoginSchemaType, LoginSchema } from "@/validation/auth-validation";
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
} from "../../ui/form";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  LogIn,
  UserPlus,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { login_user } from "@/actions/user.actions";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";

const LoginForm = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const t = useTranslations("LoginPage");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams?.get("returnUrl");

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginSchemaType) => {
    const loginPromise = login_user(data);

    toast.promise(loginPromise, {
      loading: "Logging in...",
      success: (result) => {
        form.reset();

        // If a returnUrl query param was provided, navigate there (safe check).
        if (returnUrl && returnUrl.startsWith("/")) {
          // replace so login page is not kept in history
          window.location.replace(returnUrl);
        } else {
          window.location.replace(`/${locale}/`);
        }

        return result.message;
      },
      error: (error) => {
        return error.message;
      },
      position: "top-right",
    });
  };

  const { isSubmitting } = form.formState;

  const handleSignUpClick = () => {
    console.log("Navigate to sign up");
  };

  const handleForgotPasswordClick = () => {
    console.log("Navigate to forgot password");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <LogIn className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold mb-2">{t("welcome back")}</h1>
          <p>{t("sign in subtitle")}</p>
        </div>

        {/* Login Form Card */}
        <div className="rounded-2xl shadow-xl border p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">
                      {t("email address")}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                        <Input
                          placeholder={t("email placeholder")}
                          className="pl-11 h-12 rounded-lg"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">
                      {t("password")}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder={t("password placeholder")}
                          className="pl-11 pr-11 h-12 rounded-lg"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />

              {/* Forgot Password Link */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={handleForgotPasswordClick}
                  className="text-sm font-medium transition-colors"
                >
                  {t("forgot password")}
                </button>
              </div>

              {/* Login Button */}
              <Button
                disabled={isSubmitting}
                type="submit"
                className="hover:cursor-pointer w-full h-12 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin w-5 h-5 mr-2" />
                ) : (
                  <span className="flex items-center">
                    <LogIn className="w-5 h-5 mr-2" />
                    {t("login")}
                  </span>
                )}
              </Button>
            </form>
          </Form>
        </div>

        {/* Sign Up Section */}
        <div className="mt-8 text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4">{t("new here")}</span>
            </div>
          </div>

          <div className="mt-6">
            <Button
              asChild
              variant={"outline"}
              onClick={handleSignUpClick}
              className="group inline-flex items-center justify-center px-6 py-3 text-sm font-medium border rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Link
                href={`/${locale}/auth/register`}
                className="flex items-center"
              >
                <UserPlus className="w-4 h-4 mr-2 group-hover:text-inherit" />
                {t("no account")}{" "}
                <span className="ml-1 font-semibold">{t("sign up")}</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs">
          {t("terms agreement")}{" "}
          <Link href="#" className="underline">
            {t("terms of service")}
          </Link>{" "}
          and{" "}
          <Link href="#" className="underline">
            {t("privacy policy")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

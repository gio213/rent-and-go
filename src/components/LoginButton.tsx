import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

const LoginButton = () => {
  const locale = useLocale();
  const t = useTranslations("LoginPage");
  return (
    <div>
      <Button
        variant={"ghost"}
        className="hidden md:inline-flex  font-bold"
        asChild
      >
        <Link href={`/${locale}/auth/login`}>{t("login")}</Link>
      </Button>
    </div>
  );
};

export default LoginButton;

import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useLocale } from "next-intl";

const LoginButton = () => {
  const locale = useLocale();
  return (
    <div>
      <Button
        variant={"ghost"}
        className="hidden md:inline-flex  font-bold"
        asChild
      >
        <Link href={`/${locale}/auth/login`}>Login</Link>
      </Button>
    </div>
  );
};

export default LoginButton;

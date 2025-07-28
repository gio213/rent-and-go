import LoginForm from "@/components/forms/LoginForm";
import { getTranslations } from "next-intl/server";

export default async function LoginPage() {
  const t = await getTranslations("LoginPage");

  return <LoginForm />;
}

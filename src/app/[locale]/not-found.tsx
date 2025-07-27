import NotFoundFuzzyText from "@/components/NotFoundFuzzyText";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function NotFound() {
  // Redirect to the default locale's not-found page
  return (
    <div className="flex flex-col  items-center justify-center min-h-screen ">
      <NotFoundFuzzyText
        baseIntensity={0.18}
        children="Page Not Found"
        classname="font-finger"
        colorClass="text-yellow-500"
      />
      <Button asChild className="mt-4" variant={"destructive"}>
        <Link href="/en">Back to Home</Link>
      </Button>
    </div>
  );
}

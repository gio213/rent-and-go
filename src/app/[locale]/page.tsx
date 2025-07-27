import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  return (
    <Button>
      <h1>home page</h1>
    </Button>
  );
}

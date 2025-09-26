import { getTranslations } from "next-intl/server";
import { AlertTriangle, Lock, Home, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default async function UnauthorizedPage() {
  const t = await getTranslations("UnauthorizedPage");

  
  return (
    <div className="min-h-screen flex t items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-8">
        <Card className="border-2 shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full border-2 flex items-center justify-center">
              <Lock className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold">{t("title")}</CardTitle>
              <CardDescription className="text-base">
                {t("message")}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {t("alertMessage") ||
                  "You don't have permission to access this resource."}
              </AlertDescription>
            </Alert>
          

            <Separator />

            <div className="space-y-3">
              <p className="text-sm text-center opacity-80">
                {t("helpText") ||
                  "If you believe this is an error, please contact your administrator or try the following:"}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="outline"
                  asChild
                  className="flex items-center gap-2"
                >
                  <Link href="/">
                    <Home className="w-4 h-4" />
                    {t("homeButton") || "Go Home"}
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs opacity-60">
            {t("footer") || "Error Code: 403 - Forbidden"}
          </p>
        </div>
      </div>
    </div>
  );
}

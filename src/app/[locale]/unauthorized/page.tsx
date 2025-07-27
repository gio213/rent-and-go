import { getTranslations } from "next-intl/server";

export default async function UnauthorizedPage() {
  const t = await getTranslations("UnauthorizedPage");

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {t("title")}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {t("message")}
          </p>
        </div>
      </div>
    </div>
  );
}

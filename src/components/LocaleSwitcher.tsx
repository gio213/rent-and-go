import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import LocaleSwitcherSelect from "./LocalSwitcherSelect";

export default function LocaleSwitcher() {
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect defaultValue={locale} label={locale}>
      {routing.locales.map((cur) => (
        <option key={cur} value={cur}>
          {cur}
        </option>
      ))}
    </LocaleSwitcherSelect>
  );
}

import { useLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { SelectItem } from "./ui/select";
import LocaleSwitcherSelect from "./LocalSwitcherSelect";

export default function LocaleSwitcher() {
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect defaultValue={locale} label="Language">
      {routing.locales.map((cur) => (
        <SelectItem key={cur} value={cur}>
          {cur.toUpperCase()}
        </SelectItem>
      ))}
    </LocaleSwitcherSelect>
  );
}

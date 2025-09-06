import { useLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { SelectItem } from "./ui/select";
import LocaleSwitcherSelect from "./LocalSwitcherSelect";
import geoFlag from "../../public/assets/flags/geo-flag.png";
import usFlag from "../../public/assets/flags/english-flag.png";
import ruFlag from "../../public/assets/flags/russia-flag.png";
import Image from "next/image";

// Type-safe locale type
type LocaleType = (typeof routing.locales)[number];

// Flag and language name mapping
const flagMap = {
  ka: {
    src: geoFlag,
    alt: "Georgian language",
    name: "ქართული",
    abbreviation: "KA",
  },
  en: {
    src: usFlag,
    alt: "English language",
    name: "English",
    abbreviation: "EN",
  },
  ru: {
    src: ruFlag,
    alt: "Russian language",
    name: "Русский",
    abbreviation: "RU",
  },
} as const;

export default function LocaleSwitcher() {
  const locale = useLocale();

  const getLangWithFlag = (localeCode: LocaleType) => {
    const localeInfo = flagMap[localeCode as keyof typeof flagMap];

    // Fallback to English if locale not found
    const { src, alt, name, abbreviation } = localeInfo || flagMap.en;

    return (
      <div className="flex items-center gap-2">
        <div className="flex-shrink-0">
          <Image
            src={src}
            alt={alt}
            width={24}
            height={24}
            sizes="24px"
            className="rounded-sm object-cover"
          />
        </div>
        <span className="text-sm font-medium">{abbreviation}</span>
      </div>
    );
  };

  return (
    <LocaleSwitcherSelect defaultValue={locale} label="Language">
      {routing.locales.map((currentLocale) => (
        <SelectItem key={currentLocale} value={currentLocale}>
          {getLangWithFlag(currentLocale)}
        </SelectItem>
      ))}
    </LocaleSwitcherSelect>
  );
}

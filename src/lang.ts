import type { Lang } from "./types";
import FR from "./langs/fr";
import EN from "./langs/en";

const langs = {
  fr: FR,
  en: EN,
};
let langMessages = EN;

export function t(key: keyof Lang) {
  return langMessages[key];
}

export function setLang(lang: string) {
  langMessages = lang in langs ? langs[lang as keyof typeof langs] : EN;
}

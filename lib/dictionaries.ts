const dictionaries = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  "pt-br": () => import("./dictionaries/pt-br.json").then((module) => module.default),
  fr: () => import("./dictionaries/fr.json").then((module) => module.default),
}

export const getDictionary = async (locale: "en" | "pt-br" | "fr") => dictionaries[locale]?.() ?? dictionaries.en()

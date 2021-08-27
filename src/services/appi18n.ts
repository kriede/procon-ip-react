import i18n, {TFunction} from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '../locales/en.json'
import de from '../locales/de.json'

var _useAppTranslation: TFunction = (x) => x

export function t(x: string | string[]) {
  return _useAppTranslation(prepare(x))
}

function prepare(x: string | string[]): any {
  if (Array.isArray(x)) {
    return x.map(y => prepare(y))
  } else if (typeof x === 'string') {
    return x
      .replace(' ', '-')
  }
}

export enum Language {
  English = 'en',
  Deutsch = 'de'
}

export const resources = {
  [Language.English]: {
    translation: en
  },
  [Language.Deutsch]: {
    translation: de
  }
}

export function setLanguage(code: string): Promise<{ locales: string, language: Language }> {
  const language = suggestLanguage(code)
  if (i18n.isInitialized) {
    return i18n.changeLanguage(language).then((t) => {      
      _useAppTranslation=t
      return { locales: t("locales"), language }
    })
  } else {
    return i18n
      .use(initReactI18next) // passes i18n down to react-i18next
      .init({
        resources,
        lng: language, // Language.English/ Change current language on the end of this file
        interpolation: {
          escapeValue: false // react already safes from xss
        }
      }).then((t) => {
        _useAppTranslation=t
        return { locales: t("locales"), language }
      }, (reason: any) => {
        _useAppTranslation=(x:any)=>x
        console.error(reason)
        return { locales: "en-US", language: Language.English }
      })
  }
}

export type LanguageReturnType = [string, Language]

export function getLanguagesList(): LanguageReturnType[] {
  return [
    ['English', Language.English],
    ['Deutsch', Language.Deutsch]
  ]
}

export function suggestLanguage(code: string): Language {
  if (code.length > 2) { code = code.substring(0, 2) }
  code = code.toLowerCase()
  const languages: LanguageReturnType[] = getLanguagesList()
  const languagesFiltered = languages.filter((lang) => {
    if (lang[0].toLowerCase() === code) {
      return true
    }
    if (lang[1].toLowerCase() === code) {
      return true
    }
    return false
  })
  if (languagesFiltered.length > 0) {
    return languagesFiltered[0][1]
  }
  return Language.English
}

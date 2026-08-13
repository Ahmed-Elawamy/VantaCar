import { createContext, useContext, useState, useEffect } from 'react'
import { translations, defaultLang } from './i18n'

const LangContext = createContext()

export function LangProvider({ children }) {
  const [lang, setLang] = useState(defaultLang)

  useEffect(() => {
    const html = document.documentElement
    if (lang === 'ar') {
      html.setAttribute('dir', 'rtl')
      html.setAttribute('lang', 'ar')
    } else {
      html.setAttribute('dir', 'ltr')
      html.setAttribute('lang', 'en')
    }
  }, [lang])

  const toggle = () => setLang((p) => (p === 'en' ? 'ar' : 'en'))
  const t = translations[lang]

  return (
    <LangContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within LangProvider')
  return ctx
}

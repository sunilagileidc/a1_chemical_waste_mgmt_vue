import en from './en.json'
// import ar from './ar.json'

export const defaultLocale = localStorage.getItem('pref_lang') || 'en';

export const languages = {
    en: en,
    // ar: ar
}
import { createContext, useContext } from 'react'

export const ThemeGlobalSimple = createContext({ searchModal: null })
export const useSimpleGlobal = () => useContext(ThemeGlobalSimple)

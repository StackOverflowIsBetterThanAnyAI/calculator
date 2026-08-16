import { createContext } from 'react'

export const DisplayedTextContext = createContext<
    [string, React.Dispatch<React.SetStateAction<string>>] | undefined
>(undefined)

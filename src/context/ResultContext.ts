import { createContext } from 'react'

export const ResultContext = createContext<
    [string, React.Dispatch<React.SetStateAction<string>>] | undefined
>(undefined)

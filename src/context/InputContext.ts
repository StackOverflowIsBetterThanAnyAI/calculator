import { createContext } from 'react'

export const InputContext = createContext<
    [string, React.Dispatch<React.SetStateAction<string>>] | undefined
>(undefined)

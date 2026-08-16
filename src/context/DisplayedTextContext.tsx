import { createContext, useContext, useState, type ReactNode } from 'react'
import { DEFAULT_TEXT } from '../constants/constants'
import { getItemFromSessionStorage } from '../utils/getItemFromSessionStorage'
import { setItemInSessionStorage } from '../utils/setItemInSessionStorage'

type DisplayedTextContextType = {
    displayedText: string
    setDisplayedText: React.Dispatch<React.SetStateAction<string>>
}

const DisplayedTextContext = createContext<
    DisplayedTextContextType | undefined
>(undefined)

export const DisplayedTextContextProvider = ({
    children,
}: {
    children: ReactNode
}) => {
    const parsedStorageData = getItemFromSessionStorage()

    const [displayedText, setDisplayedText] = useState<string>(() => {
        const data = parsedStorageData?.displayedText || ''
        if (data?.length && typeof data === 'string') {
            return data
        }
        setItemInSessionStorage('displayedText', DEFAULT_TEXT)
        return DEFAULT_TEXT
    })

    return (
        <DisplayedTextContext.Provider
            value={{ displayedText, setDisplayedText }}
        >
            {children}
        </DisplayedTextContext.Provider>
    )
}

export const useDisplayedTextContext = () => {
    const context = useContext(DisplayedTextContext)
    if (!context) {
        throw new Error(
            'useDisplayedTextContext must be used within a DisplayedTextContextProvider'
        )
    }
    return context
}

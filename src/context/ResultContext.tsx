import { createContext, useContext, useState, type ReactNode } from 'react'
import { getItemFromSessionStorage } from '../utils/getItemFromSessionStorage'
import { setItemInSessionStorage } from '../utils/setItemInSessionStorage'

type ResultContextType = {
    result: string
    setResult: React.Dispatch<React.SetStateAction<string>>
}

const ResultContext = createContext<ResultContextType | undefined>(undefined)

export const ResultContextProvider = ({
    children,
}: {
    children: ReactNode
}) => {
    const parsedStorageData = getItemFromSessionStorage()

    const [result, setResult] = useState<string>(() => {
        const data = parsedStorageData?.result || ''
        if (data?.length && typeof data === 'string') {
            return data
        }
        setItemInSessionStorage('result', '')
        return ''
    })

    return (
        <ResultContext.Provider value={{ result, setResult }}>
            {children}
        </ResultContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useResultContext = () => {
    const context = useContext(ResultContext)
    if (!context) {
        throw new Error(
            'useResultContext must be used within a ResultContextProvider'
        )
    }
    return context
}

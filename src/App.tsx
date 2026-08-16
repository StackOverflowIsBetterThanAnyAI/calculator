import { useState } from 'react'
import CalculatorDisplay from './components/CalculatorDisplay'
import CalculatorTable from './components/CalculatorTable'
import { DEFAULT_TEXT } from './constants/constants'
import { DisplayedTextContext } from './context/DisplayedTextContext'
import { ResultContext } from './context/ResultContext'
import { getItemFromSessionStorage } from './utils/getItemFromSessionStorage'
import { setItemInSessionStorage } from './utils/setItemInSessionStorage'

const App = () => {
    const parsedStorageData = getItemFromSessionStorage()

    const [displayedText, setDisplayedText] = useState<string>(() => {
        const data = parsedStorageData?.displayedText || ''
        if (data?.length && typeof data === 'string') {
            return data
        }
        setItemInSessionStorage('displayedText', DEFAULT_TEXT)
        return DEFAULT_TEXT
    })
    const [result, setResult] = useState<string>(() => {
        const data = parsedStorageData?.result || ''
        if (data?.length && typeof data === 'string') {
            return data
        }
        setItemInSessionStorage('result', '')
        return ''
    })

    return (
        <div className="bg-linear-to-b from-gray-800 to-gray-700 min-h-dvh flex justify-center p-0 xs:p-4">
            <main className="flex flex-col gap-3 max-w-lg w-full h-fit p-3 bg-linear-to-b from-gray-950/30 to-gray-950/70 drop-shadow-gray-800/70 drop-shadow-xl rounded-none xs:rounded-b-2xl outline-2 outline-zinc-500/50">
                <DisplayedTextContext.Provider
                    value={[displayedText, setDisplayedText]}
                >
                    <ResultContext.Provider value={[result, setResult]}>
                        <CalculatorDisplay />
                        <CalculatorTable />
                    </ResultContext.Provider>
                </DisplayedTextContext.Provider>
            </main>
        </div>
    )
}

export default App

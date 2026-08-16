import { useState } from 'react'
import CalculatorDisplay from './components/CalculatorDisplay'
import CalculatorTable from './components/CalculatorTable'
import { InputContext } from './context/InputContext'
import { ResultContext } from './context/ResultContext'
import { getItemFromSessionStorage } from './utils/getItemFromSessionStorage'
import { setItemInSessionStorage } from './utils/setItemInSessionStorage'

const App = () => {
    const parsedStorageData = getItemFromSessionStorage()

    const [input, setInput] = useState<string>(() => {
        const data = parsedStorageData?.input || ''
        if (data?.length && typeof data === 'string') {
            return data
        }
        setItemInSessionStorage(
            'input',
            'The calculator is waiting for your actions.'
        )
        return 'The calculator is waiting for your actions.'
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
        <div className="bg-linear-to-b from-gray-800 to-gray-700 min-h-dvh flex justify-center p-4">
            <main className="flex flex-col gap-3 max-w-lg w-full h-fit p-3 bg-gray-950/60 drop-shadow-gray-800/70 drop-shadow-xl rounded-b-2xl outline-2 outline-zinc-500/50">
                <InputContext.Provider value={[input, setInput]}>
                    <ResultContext.Provider value={[result, setResult]}>
                        <CalculatorDisplay />
                        <CalculatorTable />
                    </ResultContext.Provider>
                </InputContext.Provider>
            </main>
        </div>
    )
}

export default App

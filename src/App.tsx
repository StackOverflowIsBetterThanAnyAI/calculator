import { useState } from 'react'
import CalculatorDisplay from './components/CalculatorDisplay'
import { ResultContext } from './context/ResultContext'
import { InputContext } from './context/InputContext'
import CalculatorTable from './components/CalculatorTable'

const App = () => {
    const [input, setInput] = useState<string>(
        'The calculator is waiting for your actions.'
    )
    const [result, setResult] = useState<string>('Result: 10')

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

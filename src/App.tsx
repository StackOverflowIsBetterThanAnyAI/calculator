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
        <div className="bg-red-300/85 min-h-dvh flex justify-center p-4">
            <main className="flex flex-col gap-3 max-w-lg w-full h-fit p-3 bg-red-400/55">
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

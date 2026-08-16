import { useContext } from 'react'
import BlinkingCaret from './BlinkingCaret'
import { InputContext } from '../context/InputContext'
import { ResultContext } from '../context/ResultContext'

const CalculatorDisplay = () => {
    const inputContext = useContext(InputContext)
    if (!inputContext) {
        throw new Error(
            'CalculatorDisplay must be used within an InputContext.Provider'
        )
    }
    const [input, _setInput] = inputContext

    const resultContext = useContext(ResultContext)
    if (!resultContext) {
        throw new Error(
            'CalculatorDisplay must be used within a ResultContext.Provider'
        )
    }
    const [result, _setResult] = resultContext

    return (
        <div className="text-2xl flex flex-col justify-between bg-slate-700 p-3 h-36 outline-2 outline-zinc-500">
            <span>
                {input}
                <BlinkingCaret />
            </span>
            <span>{result}</span>
        </div>
    )
}

export default CalculatorDisplay

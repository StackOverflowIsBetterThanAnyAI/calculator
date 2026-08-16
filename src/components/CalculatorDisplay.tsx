import { useContext } from 'react'
import BlinkingCaret from './BlinkingCaret'
import { DisplayedTextContext } from '../context/DisplayedTextContext'
import { ResultContext } from '../context/ResultContext'

const CalculatorDisplay = () => {
    const displayedTextContext = useContext(DisplayedTextContext)
    if (!displayedTextContext) {
        throw new Error(
            'CalculatorDisplay must be used within an DisplayedTextContext.Provider'
        )
    }
    const [displayedText, _setDisplayedText] = displayedTextContext

    const resultContext = useContext(ResultContext)
    if (!resultContext) {
        throw new Error(
            'CalculatorDisplay must be used within a ResultContext.Provider'
        )
    }
    const [result, _setResult] = resultContext

    return (
        <div
            className="text-2xl flex flex-col justify-between bg-slate-700 p-3 h-36 outline-2 outline-zinc-500/50"
            data-testid="display"
        >
            <span>
                {displayedText}
                <BlinkingCaret />
            </span>
            <span>{result}</span>
        </div>
    )
}

export default CalculatorDisplay

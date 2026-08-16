import BlinkingCaret from './BlinkingCaret'
import { useDisplayedTextContext } from '../context/DisplayedTextContext'
import { useResultContext } from '../context/ResultContext'

const CalculatorDisplay = () => {
    const { displayedText } = useDisplayedTextContext()
    const { result } = useResultContext()

    return (
        <div
            className="text-xl xs:text-3xl flex flex-col justify-between bg-slate-700 p-3 h-32 xs:h-36 outline-2 outline-zinc-500/50"
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

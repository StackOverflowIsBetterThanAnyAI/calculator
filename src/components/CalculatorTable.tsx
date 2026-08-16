import { useRef } from 'react'
import CalculatorButton from './CalculatorButton'
import { tableCharacters } from '../constants/constants'
import { useDisplayedTextContext } from '../context/DisplayedTextContext'
import { useResultContext } from '../context/ResultContext'
import { addArithmeticOperator } from '../helper/addArithmeticOperator'
import { addParantheses } from '../helper/addParantheses'
import { allowCommaUsage } from '../helper/allowCommaUsage'
import { checkForAlgebraicSign } from '../helper/checkForAlgebraicSign'
import { displayNumberInput } from '../helper/displayNumberInput'
import { displayText } from '../helper/displayText'
import { displayResult } from '../helper/displayResult'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { useKeyboardInput } from '../hooks/useKeyboardInput'

const CalculatorTable = () => {
    const { displayedText, setDisplayedText } = useDisplayedTextContext()
    const { setResult } = useResultContext()

    const currentSetOfNumbers = useRef<number>(0)
    const paranthesesCounter = useRef<{ left: number; right: number }>({
        left: 0,
        right: 0,
    })

    useFocusTrap({ tableCharacters })

    const handleAddParantheses = (input: string) => {
        addParantheses({
            displayedText: input,
            paranthesesCounter,
            setDisplayedText,
            setResult,
        })
    }
    const handleCheckForAlgebraicSign = (input: string) => {
        checkForAlgebraicSign({
            currentSetOfNumbers,
            displayedText: input,
            setDisplayedText,
            setResult,
        })
    }
    const handleDisplayNumberInput = (input: string, buttonText: number) => {
        displayNumberInput({
            buttonText,
            displayedText: input,
            setDisplayedText,
            setResult,
        })
    }
    const handleDisplayResult = (input: string) => {
        displayResult({
            displayedText: input,
            paranthesesCounter,
            setDisplayedText,
            setResult,
        })
    }
    const handleDisplayText = (buttonText: number | string) => {
        displayText({
            buttonText,
            displayedText,
            handleAddParantheses,
            handleCheckForAlgebraicSign,
            handleDisplayNumberInput,
            handleDisplayResult,
            setDisplayedText,
            setResult,
        })
    }

    useKeyboardInput({
        addArithmeticOperator,
        addParantheses: handleAddParantheses,
        allowCommaUsage,
        checkForAlgebraicSign: handleCheckForAlgebraicSign,
        displayNumberInput: handleDisplayNumberInput,
        displayResult: handleDisplayResult,
        displayedText,
        setDisplayedText,
        setResult,
    })

    return (
        <table cellSpacing={0}>
            <tbody className="grid grid-rows-5 gap-1.5">
                {Array.from({
                    length: Math.ceil(tableCharacters.length / 4),
                }).map((_, rowIndex) => (
                    <tr
                        key={rowIndex}
                        className="grid grid-cols-4 w-full gap-1.5"
                    >
                        {tableCharacters
                            .slice(rowIndex * 4, rowIndex * 4 + 4)
                            .map((item, columnIndex) => (
                                <td key={columnIndex} className="w-full">
                                    <CalculatorButton
                                        ariaLabel={item[2]}
                                        bgColor={item[1]}
                                        buttonText={item[0]}
                                        handleClick={() => {
                                            handleDisplayText(item[0])
                                        }}
                                    />
                                </td>
                            ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default CalculatorTable

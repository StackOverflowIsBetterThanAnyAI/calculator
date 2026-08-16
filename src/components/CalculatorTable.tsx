import { useCallback, useRef } from 'react'
import CalculatorButton from './CalculatorButton'
import {
    DEFAULT_TEXT,
    MAX_INPUT_LENGTH,
    tableCharacters,
} from '../constants/constants'
import { useDisplayedTextContext } from '../context/DisplayedTextContext'
import { useResultContext } from '../context/ResultContext'
import { addArithmeticOperator } from '../helper/addArithmeticOperator'
import { addParantheses } from '../helper/addParantheses'
import { allowCommaUsage } from '../helper/allowCommaUsage'
import { checkForAlgebraicSign } from '../helper/checkForAlgebraicSign'
import { checkForClosingParanthesis } from '../helper/checkForClosingParanthesis'
import { checkForDeletedSpace } from '../helper/checkForDeletedSpace'
import { checkForStartingZero } from '../helper/checkForStartingZero'
import { displayResult } from '../helper/displayResult'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { useKeyboardInput } from '../hooks/useKeyboardInput'
import { setDisplayedTextInStorage } from '../utils/setDisplayedTextInStorage'

const CalculatorTable = () => {
    const { displayedText, setDisplayedText } = useDisplayedTextContext()
    const { setResult } = useResultContext()

    // ref for current set of numbers
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
    const handleDisplayResult = (input: string) => {
        displayResult({
            displayedText: input,
            paranthesesCounter,
            setDisplayedText,
            setResult,
        })
    }

    const handleDisplayText = (buttonText: string | number): void => {
        if (
            displayedText?.length > MAX_INPUT_LENGTH &&
            buttonText !== 'AC' &&
            buttonText !== 'DEL'
        ) {
            return
        }
        let updatedText = displayedText
        if (displayedText === DEFAULT_TEXT) {
            updatedText = ''
        }
        if (typeof buttonText === 'number') {
            handleNumberInput(updatedText, buttonText)
        } else if (buttonText === ',' && allowCommaUsage(updatedText)) {
            setDisplayedTextInStorage({
                input: updatedText + buttonText.toString(),
                setDisplayedText,
                setResult,
            })
        } else if (buttonText === 'AC') {
            setDisplayedTextInStorage({
                input: '',
                setDisplayedText,
                setResult,
            })
        } else if (buttonText === 'DEL') {
            setDisplayedTextInStorage({
                input: updatedText?.slice(0, updatedText.length - 1) || '',
                setDisplayedText,
                setResult,
            })
        } else if (buttonText === '+/-') {
            handleCheckForAlgebraicSign(updatedText)
        } else if (['+', '-', '/', 'x'].includes(buttonText)) {
            setDisplayedTextInStorage({
                input:
                    updatedText +
                    addArithmeticOperator(updatedText, buttonText),
                setDisplayedText,
                setResult,
            })
        } else if (buttonText === '()') {
            handleAddParantheses(updatedText)
        } else if (buttonText === '=') {
            handleDisplayResult(updatedText)
        }
    }

    const handleNumberInput = useCallback(
        (displayedText: string, buttonText: number): void => {
            if (
                displayedText &&
                !isNaN(
                    parseFloat(displayedText?.charAt(displayedText.length - 2))
                ) &&
                displayedText?.charAt(displayedText.length - 1) === ' '
            ) {
                return
            }

            setDisplayedTextInStorage({
                input:
                    checkForStartingZero(displayedText) +
                    checkForClosingParanthesis(displayedText) +
                    checkForDeletedSpace(displayedText) +
                    buttonText.toString(),
                setDisplayedText,
                setResult,
            })
        },
        [setDisplayedText, setResult]
    )

    useKeyboardInput({
        addArithmeticOperator,
        addParantheses: handleAddParantheses,
        allowCommaUsage,
        checkForAlgebraicSign: handleCheckForAlgebraicSign,
        displayResult: handleDisplayResult,
        displayedText,
        handleNumberInput,
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

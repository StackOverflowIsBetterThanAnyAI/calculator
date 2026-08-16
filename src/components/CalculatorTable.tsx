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
import { allowCommaUsage } from '../helper/allowCommaUsage'
import { calculateLeftParantheses } from '../helper/calculateLeftParantheses'
import { calculateResult } from '../helper/calculateResult'
import { calculateRightParantheses } from '../helper/calculateRightParantheses'
import { checkForClosingParanthesis } from '../helper/checkForClosingParanthesis'
import { checkForDeletedSpace } from '../helper/checkForDeletedSpace'
import { checkForStartingZero } from '../helper/checkForStartingZero'
import { removeSetOfUnusedParantheses } from '../helper/removeSetOfUnusedParantheses'
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
            setResult('')
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
            checkForAlgebraicSign(updatedText)
            setResult('')
        } else if (['+', '-', '/', 'x'].includes(buttonText)) {
            setDisplayedTextInStorage({
                input:
                    updatedText +
                    addArithmeticOperator(updatedText, buttonText),
                setDisplayedText,
                setResult,
            })
        } else if (buttonText === '()') {
            addParantheses(updatedText)
            setResult('')
        } else if (buttonText === '=') {
            displayResult(updatedText)
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
        [setDisplayedText]
    )

    // toggles the algebraic sign for the current set of numbers
    const checkForAlgebraicSign = useCallback(
        (displayedText: string): void => {
            // no actions allowed if the displayedText is equal to the default text
            if (!displayedText || !/\d/.test(displayedText)) {
                return
            }
            const splitText: string[] | undefined = displayedText
                ?.split(' ')
                .filter((item) => item !== '')
            // the content of the current set of numbers
            currentSetOfNumbers.current = splitText
                ? parseFloat(splitText[splitText.length - 1])
                : -1

            // if latest set of numbers only contains +, -, / or x, no toggle should happen
            if (
                isNaN(currentSetOfNumbers.current) &&
                splitText &&
                splitText[splitText.length - 1].length === 1
            ) {
                return
            }

            // the sets which are not the current one
            const splicedText: string =
                splitText?.splice(0, splitText.length - 1).join(' ') || ''

            // calculates the amount of parantheses
            let paranthesesCounter: number = 0
            for (let i = 0; i < (splitText?.toString().length ?? 1); i++) {
                if (splitText?.toString().charAt(i) === '(') {
                    paranthesesCounter++
                } else {
                    break
                }
            }

            // if the current number of sets is not negative / does not start with '(-' ...
            if (
                !splitText
                    ?.toString()
                    .substring(paranthesesCounter - 1)
                    .startsWith('(-')
            )
                // ... set the displayedText to the sets which have not been touched, the persisting parantheses, (- and the actual set of numbers ...
                setDisplayedTextInStorage({
                    input: `${splicedText} ${splitText
                        ?.toString()
                        .substring(0, paranthesesCounter)}(-${splitText
                        ?.toString()
                        .substring(paranthesesCounter)}`,
                    setDisplayedText,
                    setResult,
                })
            // ... otherwise set the displayedText to the sets which have not been touched, the persisting parantheses and the current set of numbers,
            // but remove one paranthesis and the negative sign
            // additionally check if the amount of left and right parantheses is the same
            // if so, also remove one closing paranthesis
            else {
                const leftParantheses = (splitText[0].match(/\(/g) || []).length
                const rightParantheses = (splitText[0].match(/\)/g) || [])
                    .length

                const invertedText = `${splicedText} ${splitText
                    .toString()
                    .substring(0, paranthesesCounter - 1)}${splitText
                    .toString()
                    .substring(paranthesesCounter - 1)
                    .slice(2)}`

                setDisplayedTextInStorage({
                    input:
                        leftParantheses === rightParantheses
                            ? invertedText.replace(/\)/, '')
                            : invertedText,
                    setDisplayedText,
                    setResult,
                })
            }
        },
        [setDisplayedText]
    )

    const addParantheses = useCallback(
        (displayedText: string): void => {
            paranthesesCounter.current = {
                left: calculateLeftParantheses(displayedText),
                right: calculateRightParantheses(displayedText),
            }

            let addMultiplication: string = ''

            let upcomingSign: string = '('

            // right paranthesis if the amount of left parantheses is greater than the amount of the right ones
            if (
                paranthesesCounter.current.left >
                paranthesesCounter.current.right
            ) {
                upcomingSign = ')'
            }

            // right paranthesis after number and if the amount of left parantheses is greater than the amount of the right
            if (
                paranthesesCounter.current.left >
                    paranthesesCounter.current.right &&
                !isNaN(
                    parseFloat(
                        displayedText?.charAt(displayedText.length - 1) || ''
                    )
                )
            ) {
                upcomingSign = ')'
            }
            // left paranthesis after number and if the amount of left parantheses equals the amount of the right ones
            // x right in front of the left paranthesis right after a number and if the amount of left parantheses is euqal to the amount of right ones
            else if (
                paranthesesCounter.current.left ===
                    paranthesesCounter.current.right &&
                !isNaN(
                    parseFloat(
                        displayedText?.charAt(displayedText.length - 1) || ''
                    )
                )
            ) {
                upcomingSign = '('
                addMultiplication =
                    paranthesesCounter.current.left ===
                    paranthesesCounter.current.right
                        ? ' x '
                        : ''
            }

            // x between right and left paranthesis if the amount of left parantheses euqals the amount of right ones
            else if (
                displayedText?.charAt(displayedText.length - 1) === ')' &&
                paranthesesCounter.current.left ===
                    paranthesesCounter.current.right
            ) {
                addMultiplication = ' x '
            }
            // after a left paranthesis there is always another one
            else if (displayedText?.charAt(displayedText.length - 1) === '(') {
                upcomingSign = '('
            }
            // there is a left paranthesis after an arithmetic operator
            else if (
                displayedText?.endsWith(' ') &&
                displayedText?.charAt(displayedText.length - 1) === ')'
            ) {
                upcomingSign = '('
            } else if (
                displayedText?.endsWith(' ') &&
                displayedText?.charAt(displayedText.length - 1) !== ')'
            )
                if (
                    ['+', '-', '/', 'x'].includes(
                        displayedText?.charAt(displayedText.length - 2) || ''
                    )
                ) {
                    upcomingSign = '('
                } else {
                    upcomingSign = 'x ('
                }
            else if (
                ['+', '-', '/', 'x'].includes(
                    displayedText?.charAt(displayedText.length - 1) || ''
                )
            ) {
                upcomingSign = ' ('
            }

            setDisplayedTextInStorage({
                input: `${displayedText || ''}${addMultiplication}${upcomingSign}`,
                setDisplayedText,
                setResult,
            })
        },
        [setDisplayedText]
    )

    const displayResult = useCallback(
        (displayedText: string): void => {
            paranthesesCounter.current = {
                left: calculateLeftParantheses(displayedText),
                right: calculateRightParantheses(displayedText),
            }

            displayedText = displayedText
                .replace(/(?<!\d),/g, '0,')
                .replace(/,$/, '')

            switch (displayedText?.slice(displayedText.length - 2)) {
                case ' +':
                case ' -':
                case ' /':
                case ' x':
                    displayedText =
                        displayedText?.slice(0, displayedText?.length - 2) || ''
                    break
            }

            switch (displayedText?.slice(displayedText.length - 3)) {
                case ' + ':
                case ' - ':
                case ' / ':
                case ' x ':
                    displayedText =
                        displayedText?.slice(0, displayedText?.length - 3) || ''
                    break
            }

            // adds missing closing parantheses
            for (
                let i = 0;
                i <
                paranthesesCounter.current.left -
                    paranthesesCounter.current.right;
                i++
            ) {
                displayedText += ')'
            }

            // removes unnecessary opening parantheses
            while (displayedText?.charAt(displayedText.length - 1) === '(') {
                displayedText = displayedText.slice(0, displayedText.length - 1)
            }

            // removes unnecessary closing paranthesis which could have been left by toggling the algebraic sign
            if (
                displayedText?.charAt(displayedText.length - 1) === ')' &&
                paranthesesCounter.current.right ===
                    paranthesesCounter.current.left + 1
            ) {
                displayedText = displayedText.slice(0, displayedText.length - 1)
            }

            // create array with set of numbers
            const splitText: string[] | undefined = displayedText
                ?.split(' ')
                .filter((item) => item !== '')

            if (splitText) {
                removeSetOfUnusedParantheses(splitText)
            }
            displayedText = splitText?.join(' ') || ''

            switch (displayedText?.slice(displayedText.length - 2)) {
                case ' +':
                case ' -':
                case ' /':
                case ' x':
                    displayedText =
                        displayedText?.slice(0, displayedText?.length - 2) || ''
                    break
            }

            switch (displayedText?.slice(displayedText.length - 3)) {
                case ' + ':
                case ' - ':
                case ' / ':
                case ' x ':
                    displayedText =
                        displayedText?.slice(0, displayedText?.length - 3) || ''
                    break
            }

            // check if there are unnecessary parantheses
            displayedText =
                displayedText &&
                displayedText
                    .split(' ')
                    .map((item) => {
                        const pLeft = (item.match(/\(/g) || []).length
                        const pRight = (item.match(/\)/g) || []).length

                        return pLeft === pRight && item.indexOf('-') === -1
                            ? item.replace(/[()]|--/g, '')
                            : item
                    })
                    .join(' ')

            displayedText = displayedText.replace(/,$/, '')

            if (displayedText) {
                const result = calculateResult(displayedText)
                const resultText =
                    isNaN(parseFloat(result)) || /Infinity/g.test(result)
                        ? `Please do not divide by Zero.`
                        : `Result: ${result}`
                setDisplayedTextInStorage({
                    input: displayedText,
                    result: resultText,
                    setDisplayedText,
                    setResult,
                })
            }
        },
        [setDisplayedText, setResult]
    )

    useKeyboardInput({
        addArithmeticOperator,
        addParantheses,
        allowCommaUsage,
        checkForAlgebraicSign,
        displayResult,
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

import { MAX_INPUT_LENGTH, DEFAULT_TEXT } from '../constants/constants'
import { setDisplayedTextInStorage } from '../utils/setDisplayedTextInStorage'
import { addArithmeticOperator } from './addArithmeticOperator'
import { allowCommaUsage } from './allowCommaUsage'

type displayTextType = {
    buttonText: number | string
    displayedText: string
    handleAddParantheses: (input: string) => void
    handleCheckForAlgebraicSign: (input: string) => void
    handleDisplayNumberInput: (input: string, buttonText: number) => void
    handleDisplayResult: (input: string) => void
    setDisplayedText: React.Dispatch<React.SetStateAction<string>>
    setResult: React.Dispatch<React.SetStateAction<string>>
}

export const displayText = ({
    buttonText,
    displayedText,
    handleAddParantheses,
    handleCheckForAlgebraicSign,
    handleDisplayNumberInput,
    handleDisplayResult,
    setDisplayedText,
    setResult,
}: displayTextType): void => {
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
        handleDisplayNumberInput(updatedText, buttonText)
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
            input: updatedText + addArithmeticOperator(updatedText, buttonText),
            setDisplayedText,
            setResult,
        })
    } else if (buttonText === '()') {
        handleAddParantheses(updatedText)
    } else if (buttonText === '=') {
        handleDisplayResult(updatedText)
    }
}

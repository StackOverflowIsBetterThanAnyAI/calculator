import { useEffect } from 'react'
import { DEFAULT_TEXT, MAX_INPUT_LENGTH } from '../constants/constants'
import { setDisplayedTextInStorage } from '../utils/setDisplayedTextInStorage'

type useKeyboardInputProps = {
    addArithmeticOperator: (input: string, buttonText: string) => string
    addParantheses: (input: string) => void
    allowCommaUsage: (input: string) => boolean
    checkForAlgebraicSign: (input: string) => void
    displayResult: (input: string) => void
    displayedText: string
    handleNumberInput: (input: string, buttonText: number) => void
    setDisplayedText: React.Dispatch<React.SetStateAction<string>>
    setResult: React.Dispatch<React.SetStateAction<string>>
}

export const useKeyboardInput = ({
    addArithmeticOperator,
    addParantheses,
    allowCommaUsage,
    checkForAlgebraicSign,
    displayResult,
    displayedText,
    handleNumberInput,
    setDisplayedText,
    setResult,
}: useKeyboardInputProps) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                displayedText &&
                displayedText?.length > MAX_INPUT_LENGTH &&
                !['Delete', 'Backspace'].includes(e.key)
            ) {
                return
            }
            let updatedText = displayedText
            if (displayedText === DEFAULT_TEXT) {
                updatedText = ''
            }
            if (
                ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].includes(
                    e.key
                )
            ) {
                handleNumberInput(updatedText, parseInt(e.key))
            } else if (e.key === ',' && allowCommaUsage(updatedText)) {
                setDisplayedTextInStorage({
                    input: updatedText + e.key.toString(),
                    setDisplayedText,
                    setResult,
                })
            } else if (['+', '-', '/', '*', 'x'].includes(e.key)) {
                setDisplayedTextInStorage({
                    input:
                        updatedText +
                        addArithmeticOperator(
                            updatedText,
                            e.key.replace(/\*/g, 'x')
                        ),
                    setDisplayedText,
                    setResult,
                })
            } else if (e.key === '(' || e.key === ')') {
                addParantheses(updatedText)
            } else if (e.key === 'Control') {
                checkForAlgebraicSign(updatedText)
            } else if (e.key === 'Backspace') {
                setDisplayedTextInStorage({
                    input: updatedText?.slice(0, updatedText.length - 1) || '',
                    setDisplayedText,
                    setResult,
                })
            } else if (e.key === 'Delete') {
                setDisplayedTextInStorage({
                    input: '',
                    setDisplayedText,
                    setResult,
                })
            } else if (e.key === 'Enter') {
                e.preventDefault()
                displayResult(updatedText)
            }
        }

        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [
        addArithmeticOperator,
        addParantheses,
        allowCommaUsage,
        checkForAlgebraicSign,
        displayResult,
        displayedText,
        handleNumberInput,
        setDisplayedText,
        setResult,
    ])
}

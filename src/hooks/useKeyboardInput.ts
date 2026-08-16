import { useEffect } from 'react'

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
    const MAX_INPUT_LENGTH = 64

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                displayedText &&
                displayedText?.length > MAX_INPUT_LENGTH &&
                !['Delete', 'Backspace'].includes(e.key)
            ) {
                return
            }
            if (
                ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].includes(
                    e.key
                )
            ) {
                handleNumberInput(displayedText, parseInt(e.key))
                setResult('')
            }
            if (e.key === ',' && allowCommaUsage(displayedText)) {
                setDisplayedText(displayedText + e.key.toString())
                setResult('')
            }
            if (['+', '-', '/', '*', 'x'].includes(e.key)) {
                setDisplayedText(
                    displayedText +
                        addArithmeticOperator(
                            displayedText,
                            e.key.replace(/\*/g, 'x')
                        )
                )
                setResult('')
            }
            if (e.key === '(' || e.key === ')') {
                addParantheses(displayedText)
                setResult('')
            }
            if (e.key === 'Control') {
                checkForAlgebraicSign(displayedText)
                setResult('')
            }
            if (e.key === 'Backspace') {
                setDisplayedText(
                    displayedText?.slice(0, displayedText.length - 1) || ''
                )
                setResult('')
            }
            if (e.key === 'Delete') {
                setResult('')
                setDisplayedText('')
            }
            if (e.key === 'Enter') {
                e.preventDefault()
                displayResult(displayedText)
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

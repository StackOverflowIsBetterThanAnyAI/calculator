import { setDisplayedTextInStorage } from '../utils/setDisplayedTextInStorage'
import { checkForClosingParanthesis } from './checkForClosingParanthesis'
import { checkForDeletedSpace } from './checkForDeletedSpace'
import { checkForStartingZero } from './checkForStartingZero'

type displayNumberInputType = {
    buttonText: number
    displayedText: string
    setDisplayedText: React.Dispatch<React.SetStateAction<string>>
    setResult: React.Dispatch<React.SetStateAction<string>>
}

export const displayNumberInput = ({
    buttonText,
    displayedText,
    setDisplayedText,
    setResult,
}: displayNumberInputType): void => {
    if (
        displayedText &&
        !isNaN(parseFloat(displayedText?.charAt(displayedText.length - 2))) &&
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
}

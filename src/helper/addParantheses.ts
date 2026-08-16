import { setDisplayedTextInStorage } from '../utils/setDisplayedTextInStorage'
import { calculateLeftParantheses } from './calculateLeftParantheses'
import { calculateRightParantheses } from './calculateRightParantheses'

type addParanthesesType = {
    displayedText: string
    paranthesesCounter: React.RefObject<{
        left: number
        right: number
    }>
    setDisplayedText: React.Dispatch<React.SetStateAction<string>>
    setResult: React.Dispatch<React.SetStateAction<string>>
}

export const addParantheses = ({
    displayedText,
    paranthesesCounter,
    setDisplayedText,
    setResult,
}: addParanthesesType): void => {
    paranthesesCounter.current = {
        left: calculateLeftParantheses(displayedText),
        right: calculateRightParantheses(displayedText),
    }

    let addMultiplication: string = ''

    let upcomingSign: string = '('

    // right paranthesis if the amount of left parantheses is greater than the amount of the right ones
    if (paranthesesCounter.current.left > paranthesesCounter.current.right) {
        upcomingSign = ')'
    }

    // right paranthesis after number and if the amount of left parantheses is greater than the amount of the right
    if (
        paranthesesCounter.current.left > paranthesesCounter.current.right &&
        !isNaN(
            parseFloat(displayedText?.charAt(displayedText.length - 1) || '')
        )
    ) {
        upcomingSign = ')'
    }
    // left paranthesis after number and if the amount of left parantheses equals the amount of the right ones
    // x right in front of the left paranthesis right after a number and if the amount of left parantheses is euqal to the amount of right ones
    else if (
        paranthesesCounter.current.left === paranthesesCounter.current.right &&
        !isNaN(
            parseFloat(displayedText?.charAt(displayedText.length - 1) || '')
        )
    ) {
        upcomingSign = '('
        addMultiplication =
            paranthesesCounter.current.left === paranthesesCounter.current.right
                ? ' x '
                : ''
    }

    // x between right and left paranthesis if the amount of left parantheses euqals the amount of right ones
    else if (
        displayedText?.charAt(displayedText.length - 1) === ')' &&
        paranthesesCounter.current.left === paranthesesCounter.current.right
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
}

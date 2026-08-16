import { setDisplayedTextInStorage } from '../utils/setDisplayedTextInStorage'
import { calculateLeftParantheses } from './calculateLeftParantheses'
import { calculateResult } from './calculateResult'
import { calculateRightParantheses } from './calculateRightParantheses'
import { removeSetOfUnusedParantheses } from './removeSetOfUnusedParantheses'

type displayResultType = {
    displayedText: string
    paranthesesCounter: React.RefObject<{
        left: number
        right: number
    }>
    setDisplayedText: React.Dispatch<React.SetStateAction<string>>
    setResult: React.Dispatch<React.SetStateAction<string>>
}

export const displayResult = ({
    displayedText,
    paranthesesCounter,
    setDisplayedText,
    setResult,
}: displayResultType): void => {
    paranthesesCounter.current = {
        left: calculateLeftParantheses(displayedText),
        right: calculateRightParantheses(displayedText),
    }

    displayedText = displayedText.replace(/(?<!\d),/g, '0,').replace(/,$/, '')

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

    for (
        let i = 0;
        i < paranthesesCounter.current.left - paranthesesCounter.current.right;
        i++
    ) {
        displayedText += ')'
    }

    while (displayedText?.charAt(displayedText.length - 1) === '(') {
        displayedText = displayedText.slice(0, displayedText.length - 1)
    }

    // removes unnecessary closing paranthesis which could have been left by toggling the algebraic sign
    if (
        displayedText?.charAt(displayedText.length - 1) === ')' &&
        paranthesesCounter.current.right === paranthesesCounter.current.left + 1
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
}

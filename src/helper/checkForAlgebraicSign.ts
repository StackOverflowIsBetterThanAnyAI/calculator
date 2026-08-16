import { setDisplayedTextInStorage } from '../utils/setDisplayedTextInStorage'

type checkForAlgebraicSignType = {
    currentSetOfNumbers: React.RefObject<number>
    displayedText: string
    setDisplayedText: React.Dispatch<React.SetStateAction<string>>
    setResult: React.Dispatch<React.SetStateAction<string>>
}

export const checkForAlgebraicSign = ({
    currentSetOfNumbers,
    displayedText,
    setDisplayedText,
    setResult,
}: checkForAlgebraicSignType): void => {
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
        const rightParantheses = (splitText[0].match(/\)/g) || []).length

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
}

export const allowCommaUsage = (displayedText: string): boolean => {
    // no Comma is allowed in the beginning of a new set of numbers
    if (!displayedText?.length) {
        return false
    }

    const splitDisplayedText: string[] = displayedText.split(' ')
    const numberToCheck: number = splitDisplayedText.length - 1

    // no Comma is allowed right after a closing paranthesis
    if (
        !splitDisplayedText[numberToCheck].length ||
        splitDisplayedText[numberToCheck].endsWith(')')
    ) {
        return false
    }
    for (let i = 0; i < splitDisplayedText[numberToCheck].length; i++) {
        // there is only one single Comma allowed in each set of numbers
        if (splitDisplayedText[numberToCheck].charAt(i) === ',') {
            return false
        }
    }
    return true
}

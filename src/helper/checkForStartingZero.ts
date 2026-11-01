// checks if the user is allowed to type '0' or not
export const checkForStartingZero = (displayedText: string): string => {
    const splitDisplayedText: string[] = displayedText
        ? displayedText.split(' ')
        : []

    // the latest set of numbers without its leading parantheses and negative sign, e.g. '((-0' becomes '0'
    const currentSetOfNumbers: string = (
        splitDisplayedText[splitDisplayedText.length - 1] || ''
    ).replace(/^\(+-?/, '')

    // a single leading '0' without a Comma is removed, so it gets replaced by the upcoming number
    if (currentSetOfNumbers === '0') {
        return displayedText.slice(0, displayedText.length - 1)
    }
    // change nothing
    return displayedText || ''
}

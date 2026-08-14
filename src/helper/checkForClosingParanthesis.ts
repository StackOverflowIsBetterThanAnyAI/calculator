export const checkForClosingParanthesis = (
    displayedText: string | null
): string => {
    return displayedText?.charAt(displayedText.length - 1) === ')' ? ' x ' : ''
}

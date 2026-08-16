export const checkForClosingParanthesis = (displayedText: string): string => {
    return displayedText?.charAt(displayedText.length - 1) === ')' ? ' x ' : ''
}

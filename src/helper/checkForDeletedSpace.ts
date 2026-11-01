export const checkForDeletedSpace = (displayedText: string): string => {
    if (
        displayedText?.length &&
        ['+', '-', '/', 'x'].includes(
            displayedText?.charAt(displayedText.length - 1)
        ) &&
        // no space after the negative sign of a toggled set of numbers like '(-'
        !displayedText.endsWith('(-')
    )
        return ' '
    return ''
}

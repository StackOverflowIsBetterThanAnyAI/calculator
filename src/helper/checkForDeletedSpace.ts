export const checkForDeletedSpace = (displayedText: string): string => {
    if (
        displayedText?.length &&
        ['+', '-', '/', 'x'].includes(
            displayedText?.charAt(displayedText.length - 1)
        )
    )
        return ' '
    return ''
}

export const removeSetOfUnusedParantheses = (
    splitText: string[] | undefined
): string => {
    if (!splitText) {
        return ''
    }
    for (let i = 0; i < splitText[splitText.length - 1]?.length; i++) {
        if (
            splitText[splitText.length - 1].charAt(i) === '(' &&
            splitText[splitText.length - 1].charAt(i + 1) === ')'
        ) {
            const newSplitText: string[] = splitText
            newSplitText[splitText.length - 1] =
                splitText[splitText.length - 1].substring(0, i) +
                splitText[splitText.length - 1].substring(i + 2)
            removeSetOfUnusedParantheses(newSplitText)
        }
    }
    splitText = splitText.filter((item) => item !== '')
    return splitText[splitText.length - 1]
}

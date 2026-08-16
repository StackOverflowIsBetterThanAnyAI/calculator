export const calculateRightParantheses = (displayedText: string): number => {
    if (!displayedText?.length) {
        return -1
    }

    let counterRightParantheses: number = 0
    for (let i = 0; i < displayedText.length; i++) {
        if (displayedText.charAt(i) === ')') {
            counterRightParantheses++
        }
    }
    return counterRightParantheses
}

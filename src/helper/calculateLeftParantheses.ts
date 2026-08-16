export const calculateLeftParantheses = (displayedText: string): number => {
    if (!displayedText?.length) {
        return -1
    }

    let counterLeftParantheses: number = 0
    for (let i = 0; i < displayedText.length; i++) {
        if (displayedText.charAt(i) === '(') {
            counterLeftParantheses++
        }
    }
    return counterLeftParantheses
}

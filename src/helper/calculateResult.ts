export const calculateResult = (displayedText: string): string => {
    if (!displayedText?.length) {
        return ''
    }

    // turns default x,yz text content into x.yz for the calculation process
    displayedText = displayedText.replace(/,/g, '.')

    // array which contains every set of numbers
    let splitText: string[] = displayedText.split(' ')

    // first, calculate if the array contains parantheses, points or dashes
    let calculationContent: {
        parantheses: boolean
        points: boolean
        dashes: boolean
    } = returnCalculationContent(splitText)

    // then, solve parantheses
    if (
        calculationContent.parantheses &&
        !calculationContent.points &&
        !calculationContent.dashes
    ) {
        return displayedText.replace(/[()]/g, '')
    }

    if (calculationContent.parantheses) {
        displayedText = recursiveParanthesesCalculation(displayedText)
    }

    splitText = displayedText.split(' ')
    calculationContent = returnCalculationContent(splitText)

    // then, solve points
    if (calculationContent.points && !calculationContent.parantheses) {
        displayedText = recursivePointCalculation(splitText).join(' ')
    }

    splitText = displayedText.split(' ')
    calculationContent = returnCalculationContent(splitText)

    // then, solve dashes
    if (calculationContent.dashes && !calculationContent.parantheses) {
        displayedText = solveDashCalculation(splitText)
    }

    // returns a number with maximum four numbers after the comma
    return parseFloat(displayedText.replace(/--/g, ''))
        .toFixed(4)
        .replace(/0*$/, '')
        .replace(/\./, ',')
        .replace(/,$/, '')
}

// solves the parantheses calculations into easier input
const recursiveParanthesesCalculation = (displayedText: string): string => {
    // 1) scan displayedText for the first opening paranthesis
    // 2) scan displayedText for the first closing paranthesis
    // 3) if there is another opening paranthesis before the first closing paranthesis, the new one is the selected one
    // 4) if the first closing paranthesis has been found
    // - extract the calculation
    // - calculate the result
    // - insert it back
    // - and remove both parantheses
    // 5) repeat steps 1) to 4) until there are no parantheses left
    let indexOpeningParanthesis: number = 0
    let indexClosingParanthesis: number = 0
    // find the first opening and closing paranthesis
    for (let i = 0; i < displayedText.length; i++) {
        if (displayedText.charAt(i) === '(') {
            indexOpeningParanthesis = i
            continue
        }
        if (displayedText.charAt(i) === ')') {
            indexClosingParanthesis = i
            break
        }
    }

    if (indexClosingParanthesis) {
        const insideParantheses: string = displayedText.slice(
            indexOpeningParanthesis + 1,
            indexClosingParanthesis
        )
        const splitText: string[] = insideParantheses.split(' ')
        const pointSolved: string[] = recursivePointCalculation(splitText)
        const dashSolved: string = solveDashCalculation(pointSolved)

        // return the calculated result back into the string
        const updatedDisplayedText: string =
            displayedText.slice(0, indexOpeningParanthesis) +
            dashSolved +
            displayedText.slice(indexClosingParanthesis + 1)

        return recursiveParanthesesCalculation(updatedDisplayedText)
    }
    return displayedText
}

const recursivePointCalculation = (splitText: string[]): string[] => {
    const workingArray = [...splitText]

    const operatorIndex = workingArray.findIndex(
        (item) => item === 'x' || item === '/'
    )

    if (operatorIndex === -1) {
        return workingArray
    }

    const valueOne = workingArray[operatorIndex - 1]
    const algebraicSign = workingArray[operatorIndex]
    const valueTwo = workingArray[operatorIndex + 1]

    const calculatedValue = solvePointCalculation(
        valueOne,
        algebraicSign,
        valueTwo
    )

    workingArray.splice(operatorIndex - 1, 3, calculatedValue)

    return recursivePointCalculation(workingArray)
}

const solvePointCalculation = (
    valueOne: string,
    algebraicSign: string,
    valueTwo: string
): string => {
    switch (algebraicSign) {
        case 'x':
            return (parseFloat(valueOne) * parseFloat(valueTwo)).toString()
        default:
            return (parseFloat(valueOne) / parseFloat(valueTwo)).toString()
    }
}

const solveDashCalculation = (splitText: string[]): string => {
    if (splitText.length === 1) {
        return splitText[0]
    }
    let result: number = 0

    for (let i = 0; i < splitText?.length; i++) {
        if (i <= splitText?.length - 2) {
            switch (splitText[i + 1]) {
                case '+':
                    result =
                        i === 0
                            ? parseFloat(splitText[i]) +
                              parseFloat(splitText[i + 2])
                            : result + parseFloat(splitText[i + 2])
                    break
                case '-':
                    result =
                        i === 0
                            ? parseFloat(splitText[i]) -
                              parseFloat(splitText[i + 2])
                            : result - parseFloat(splitText[i + 2])
                    break
            }
        }
    }
    return result.toString()
}

// returns an object which tells you if the input contains parantheses, + or /, and + or -
const returnCalculationContent = (splitText: string[]) => {
    return splitText
        ? {
              parantheses: splitText.some((content) => content.includes('(')),
              points: splitText.some(
                  (content) => content.includes('x') || content.includes('/')
              ),
              dashes: splitText.some(
                  (content) => content.includes('+') || content.includes('-')
              ),
          }
        : {
              parantheses: false,
              points: false,
              dashes: false,
          }
}

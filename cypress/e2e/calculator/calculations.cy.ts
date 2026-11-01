/// <reference types="cypress" />

type CalculationCase = {
    description: string
    buttons: string[]
    expected: string
}

const KEYBOARD_KEYS: Record<string, string> = {
    '()': '(',
    '+/-': 'Control',
    '=': 'Enter',
    x: '*',
}

const clickButtons = (buttons: string[]) => {
    buttons.forEach((button) => {
        cy.get(`[data-testid="button-${button}"]`).click()
    })
}

const typeKeys = (buttons: string[]) => {
    buttons.forEach((button) => {
        cy.get('body').trigger('keydown', {
            key: KEYBOARD_KEYS[button] ?? button,
        })
    })
}

const calculationCases: CalculationCase[] = [
    {
        description: 'adds two numbers',
        buttons: ['1', '2', '+', '3', '4', '='],
        expected: '12 + 34|Result: 46',
    },
    {
        description: 'subtracts into a negative result',
        buttons: ['5', '-', '8', '='],
        expected: '5 - 8|Result: -3',
    },
    {
        description: 'multiplies decimal numbers',
        buttons: ['2', ',', '5', 'x', '4', '='],
        expected: '2,5 x 4|Result: 10',
    },
    {
        description: 'rounds divisions to four decimals',
        buttons: ['2', '/', '3', '='],
        expected: '2 / 3|Result: 0,6667',
    },
    {
        description: 'removes trailing zeros of decimals',
        buttons: ['1', '/', '8', '='],
        expected: '1 / 8|Result: 0,125',
    },
    {
        description: 'avoids floating point errors',
        buttons: ['0', ',', '1', '+', '0', ',', '2', '='],
        expected: '0,1 + 0,2|Result: 0,3',
    },
    {
        description: 'solves multiplication before addition',
        buttons: ['2', '+', '3', 'x', '4', '='],
        expected: '2 + 3 x 4|Result: 14',
    },
    {
        description: 'solves multiplication and division from left to right',
        buttons: ['8', '/', '2', 'x', '4', '='],
        expected: '8 / 2 x 4|Result: 16',
    },
    {
        description: 'solves mixed operators in the correct order',
        buttons: ['1', '0', '-', '4', '/', '2', 'x', '3', '+', '1', '='],
        expected: '10 - 4 / 2 x 3 + 1|Result: 5',
    },
    {
        description: 'handles large numbers',
        buttons: ['1', '2', '3', '4', '5', '6', '7', '8', 'x', '9', '='],
        expected: '12345678 x 9|Result: 111111102',
    },
    {
        description: 'solves parantheses first',
        buttons: ['()', '2', '+', '3', '()', 'x', '4', '='],
        expected: '(2 + 3) x 4|Result: 20',
    },
    {
        description: 'adds a multiplication between a number and a paranthesis',
        buttons: ['3', '()', '4', '+', '1', '='],
        expected: '3 x (4 + 1)|Result: 15',
    },
    {
        description: 'solves nested parantheses',
        buttons: [
            '5',
            'x',
            '()',
            '()',
            '2',
            '+',
            '3',
            '()',
            '-',
            '1',
            '()',
            '=',
        ],
        expected: '5 x ((2 + 3) - 1)|Result: 20',
    },
    {
        description: 'calculates with a toggled negative number',
        buttons: ['7', '+/-', 'x', '3', '='],
        expected: '(-7 x 3)|Result: -21',
    },
    {
        description: 'subtracts a negative number',
        buttons: ['6', '-', '9', '+/-', '='],
        expected: '6 - (-9)|Result: 15',
    },
    {
        description:
            'does not add a space after the negative sign of an empty set of numbers',
        buttons: [
            '9',
            '0',
            '()',
            '()',
            '+/-',
            '2',
            '()',
            '-',
            '3',
            '4',
            '0',
            '6',
            '=',
        ],
        expected: '90 x (((-2) - 3406))|Result: -306720',
    },
    {
        description:
            'ignores an arithmetic operator in front of an empty paranthesis',
        buttons: ['7', '()', '2', '6', 'x', '()', '='],
        expected: '7 x 26|Result: 182',
    },
    {
        description: 'does not allow a comma after a closing paranthesis',
        buttons: ['7', '+/-', '2', '()', ',', '8', '='],
        expected: '(-72) x 8|Result: -576',
    },
    {
        description: 'removes a trailing comma before a paranthesis',
        buttons: ['4', ',', '()', '9', '='],
        expected: '4 x 9|Result: 36',
    },
    {
        description: 'does not allow leading zeros inside parantheses',
        buttons: ['3', '()', '0', '4', '='],
        expected: '3 x 4|Result: 12',
    },
    {
        description: 'ignores a trailing comma',
        buttons: ['2', ',', '='],
        expected: '2|Result: 2',
    },
    {
        description: 'ignores a trailing arithmetic operator',
        buttons: ['5', '+', '='],
        expected: '5|Result: 5',
    },
    {
        description: 'displays an error for a division by a zero paranthesis',
        buttons: ['4', '/', '()', '5', '-', '5', '='],
        expected: '4 / (5 - 5)|Please do not divide by Zero.',
    },
]

describe('Calculator Calculations', () => {
    beforeEach(() => {
        cy.visit('/')
        cy.get('[data-testid="button-AC"]').click()
        cy.get('[data-testid="display"]').should('have.text', '|')
    })

    describe('mouse input', () => {
        calculationCases.forEach(({ description, buttons, expected }) => {
            it(`${description}`, () => {
                clickButtons(buttons)
                cy.get('[data-testid="display"]').should('have.text', expected)
            })
        })
    })

    describe('keyboard input', () => {
        calculationCases.forEach(({ description, buttons, expected }) => {
            it(`${description}`, () => {
                typeKeys(buttons)
                cy.get('[data-testid="display"]').should('have.text', expected)
            })
        })
    })

    it('continues calculating with the previous expression', () => {
        clickButtons(['2', '+', '3', '='])
        cy.get('[data-testid="display"]').should('have.text', '2 + 3|Result: 5')

        clickButtons(['x', '4', '='])
        cy.get('[data-testid="display"]').should(
            'have.text',
            '2 + 3 x 4|Result: 14'
        )
    })

    it('deletes the latest input before calculating', () => {
        clickButtons(['9', '+', '5', 'DEL', '1', '='])
        cy.get('[data-testid="display"]').should(
            'have.text',
            '9 + 1|Result: 10'
        )
    })
})

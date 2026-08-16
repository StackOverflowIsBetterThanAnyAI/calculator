const COLOR_NUMBERS: string = 'bg-blue-700/80'
const COLOR_SYMBOLS: string = 'bg-indigo-900'
const COLOR_EQUALS: string = 'bg-indigo-700/20'

export type TableCharacterProps = [string | number, string, string]

export const tableCharacters: TableCharacterProps[] = [
    ['AC', COLOR_SYMBOLS, 'Clear all'],
    ['/', COLOR_SYMBOLS, 'Divide'],
    ['x', COLOR_SYMBOLS, 'Multiply'],
    ['DEL', COLOR_SYMBOLS, 'Delete'],
    [7, COLOR_NUMBERS, '7'],
    [8, COLOR_NUMBERS, '8'],
    [9, COLOR_NUMBERS, '9'],
    ['-', COLOR_SYMBOLS, 'Subtract'],
    [4, COLOR_NUMBERS, '4'],
    [5, COLOR_NUMBERS, '5'],
    [6, COLOR_NUMBERS, '6'],
    ['+', COLOR_SYMBOLS, 'Add'],
    [1, COLOR_NUMBERS, '1'],
    [2, COLOR_NUMBERS, '2'],
    [3, COLOR_NUMBERS, '3'],
    ['()', COLOR_SYMBOLS, 'Parantheses'],
    [0, COLOR_NUMBERS, '0'],
    [',', COLOR_SYMBOLS, 'Decimal point'],
    ['+/-', COLOR_SYMBOLS, 'Toggle sign'],
    ['=', COLOR_EQUALS, 'Calculate Result'],
]

export const MAX_INPUT_LENGTH = 64

export const DEFAULT_TEXT = 'The calculator is waiting for your actions.'

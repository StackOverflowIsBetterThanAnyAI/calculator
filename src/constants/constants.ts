const COLOR_NUMBERS: string = 'bg-blue-700/80'
const COLOR_SYMBOLS: string = 'bg-indigo-900'
const COLOR_EQUALS: string = 'bg-indigo-700/20'

export type TableCharacterProps = [string | number, string]

export const tableCharacters: TableCharacterProps[] = [
    ['AC', COLOR_SYMBOLS],
    ['/', COLOR_SYMBOLS],
    ['x', COLOR_SYMBOLS],
    ['DEL', COLOR_SYMBOLS],
    [7, COLOR_NUMBERS],
    [8, COLOR_NUMBERS],
    [9, COLOR_NUMBERS],
    ['-', COLOR_SYMBOLS],
    [4, COLOR_NUMBERS],
    [5, COLOR_NUMBERS],
    [6, COLOR_NUMBERS],
    ['+', COLOR_SYMBOLS],
    [1, COLOR_NUMBERS],
    [2, COLOR_NUMBERS],
    [3, COLOR_NUMBERS],
    ['()', COLOR_SYMBOLS],
    [0, COLOR_NUMBERS],
    [',', COLOR_SYMBOLS],
    ['+/-', COLOR_SYMBOLS],
    ['=', COLOR_EQUALS],
]

export const MAX_INPUT_LENGTH = 64

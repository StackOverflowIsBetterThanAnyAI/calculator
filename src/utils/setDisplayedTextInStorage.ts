import { setItemInSessionStorage } from './setItemInSessionStorage'

type setDisplayedTextInStorageProps = {
    input: string
    result?: string
    setDisplayedText: React.Dispatch<React.SetStateAction<string>>
    setResult: React.Dispatch<React.SetStateAction<string>>
}

export const setDisplayedTextInStorage = ({
    input,
    result = '',
    setDisplayedText,
    setResult,
}: setDisplayedTextInStorageProps) => {
    setDisplayedText(input)
    setItemInSessionStorage('displayedText', input)
    setResult(result)
    setItemInSessionStorage('result', result)
}

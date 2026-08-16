import { type MouseEventHandler } from 'react'

type CalculatorButtonProps = {
    bgColor: string
    buttonText: string | number
    handleClick: MouseEventHandler
}

const CalculatorButton = ({
    bgColor,
    buttonText,
    handleClick,
}: CalculatorButtonProps) => {
    return (
        <button
            className={`aspect-square w-full rounded-full text-3xl hover:opacity-85 active:opacity-60 focus-visible:outline-3 outline-zinc-50 ${bgColor} drop-shadow-gray-700/20 drop-shadow-xl`}
            onClick={handleClick}
            data-testid={`button-${buttonText}`}
        >
            {buttonText}
        </button>
    )
}

export default CalculatorButton

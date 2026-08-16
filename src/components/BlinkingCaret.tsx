const BlinkingCaret = () => {
    return (
        <span
            className="text-xl xs:text-3xl text-zinc-100 animate-[pulse_1.25s_ease-in-out_infinite] ml-0.5"
            aria-hidden="true"
        >
            |
        </span>
    )
}

export default BlinkingCaret

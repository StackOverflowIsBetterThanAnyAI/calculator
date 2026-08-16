import CalculatorDisplay from './components/CalculatorDisplay'
import CalculatorTable from './components/CalculatorTable'
import { DisplayedTextContextProvider } from './context/DisplayedTextContext'
import { ResultContextProvider } from './context/ResultContext'

const App = () => {
    return (
        <div className="bg-linear-to-b from-gray-800 to-gray-700 min-h-dvh flex justify-center p-0 xs:p-4">
            <main className="flex flex-col gap-3 max-w-lg w-full h-fit p-3 bg-linear-to-b from-gray-950/30 to-gray-950/70 drop-shadow-gray-800/70 drop-shadow-xl rounded-none xs:rounded-b-2xl outline-2 outline-zinc-500/50">
                <DisplayedTextContextProvider>
                    <ResultContextProvider>
                        <CalculatorDisplay />
                        <CalculatorTable />
                    </ResultContextProvider>
                </DisplayedTextContextProvider>
            </main>
        </div>
    )
}

export default App

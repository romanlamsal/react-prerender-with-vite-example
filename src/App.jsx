import { Route, Routes } from "react-router-dom"
import { useState } from "react"

export const App = () => {
    const [counter, setCounter] = useState(0)
    return (
        <div className="App">
            <Routes>
                <Route
                    path={"/generate-me"}
                    element={
                        <div>
                            I am the generated markup! Clicked: <button onClick={() => setCounter(counter + 1)}>{counter}</button>
                        </div>
                    }
                />
                <Route path={"/"} element={<div>I am the default route.</div>} />
            </Routes>
        </div>
    )
}

import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PostMain from "./components/PostMain.js";
import PostView from "./components/PostView.js";
import PostWrite from "./components/PostWrite.js";
import PostEdit from "./components/PostEdit.js";

function App() {
    const [inputValue, setInputValue] = useState('')

    

    return (
        <div id="App">
            <BrowserRouter>
                <Routes>
                    <Route exact path="/edit" element={<PostEdit></PostEdit>}/>
                    <Route exact path="/write" element={<PostWrite></PostWrite>}/>
                    <Route exact path="/view" element={<PostView></PostView>}/>
                    <Route exact path="/"  element={<PostMain></PostMain>}/>
                </Routes>
            </BrowserRouter>
        </div>
    )

}

export default App
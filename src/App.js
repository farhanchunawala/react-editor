import React, { useState } from "react";
import "./App.css";

import MyEditor from "./components/MyEditor.js";

function App() {
    return (
        <div className="App">
            <h4>Demo editor by Farhan Chunawala</h4>
			<MyEditor/>
        </div>
    );
}

export default App;

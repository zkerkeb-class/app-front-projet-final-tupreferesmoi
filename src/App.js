import React from "react";
import Layout from "./components/layout/Layout.jsx";
import MainContent from "./components/layout/MainContent.jsx";
import "./App.css";

function App() {
    return (
        <div className="app">
            <Layout>
                <MainContent />
            </Layout>
        </div>
    );
}

export default App;

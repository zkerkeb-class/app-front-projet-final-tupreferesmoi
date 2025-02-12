import React from "react";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import Player from "./Player.jsx";
import MainContent from "./MainContent.jsx";
import "../../styles/Layout.css";

const Layout = ({ children }) => {
    return (
        <div className="layout">
            <Sidebar />
            <div className="main-container">
                <Header />
                <MainContent>{children}</MainContent>
            </div>
            <Player />
        </div>
    );
};

export default Layout;

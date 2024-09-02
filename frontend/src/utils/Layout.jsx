import Sidebar from "../utils/Sidebar";
import Navbar from "../utils/Navbar";
import { useState } from "react";

export default function Layout({ children }) {

    const [sidebarToggled, setSidebarToggled] = useState(false)

    return (
        <div className="flex-1 flex flex-col">
            <Navbar sidebarToggled={sidebarToggled} setSidebarToggled={setSidebarToggled}/>
            <div className="flex h-screen overflow-hidden">
            <Sidebar sidebarToggled={sidebarToggled}/>
                <div className="flex-1 overflow-auto p-4">
                    {children}
                </div>
            </div>
        </div>
    );
}

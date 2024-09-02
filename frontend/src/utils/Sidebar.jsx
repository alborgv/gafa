import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineDashboard } from "react-icons/md";
import { SiMarketo } from "react-icons/si";
import { FaPeopleGroup } from "react-icons/fa6";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { FaFileInvoiceDollar } from "react-icons/fa";

export default function Sidebar() {
    const navigate = useNavigate();

    const Menus = [
        { title: "Dashboard", redirect: "/", icon: <MdOutlineDashboard size={25}/> },
        { title: "Comercializadoras", redirect: "/comercializadoras", icon: <SiMarketo size={25}/>},
        { title: "Contribuyentes", redirect: "/contribuyentes", icon: <FaPeopleGroup size={25}/>},
        { title: "UVT", redirect: "/uvt", icon: <RiMoneyDollarCircleFill size={25}/> },
        { title: "Consulta", redirect: "/consulta", icon: <FaFileInvoiceDollar size={25}/>},
    ];

    const currentPath = window.location.pathname;
    const initialIndex = Menus.findIndex(menu => menu.redirect === currentPath);
    const [selectedIndex, setSelectedIndex] = useState(initialIndex !== -1 ? initialIndex : 0);

    const [showText, setShowText] = useState(Array(Menus.length).fill(false));
    const [timeouts, setTimeouts] = useState([]);

    const handleMouseEnter = () => {
        const newTimeouts = Menus.map((_, index) => {
            return setTimeout(() => {
                setShowText(prev => {
                    const newShowText = [...prev];
                    newShowText[index] = true;
                    return newShowText;
                });
            }, index * 50); 
        });
        
        setTimeouts(newTimeouts);
    };

    const handleMouseLeave = () => {
        timeouts.forEach(timeout => clearTimeout(timeout));
        setShowText(Array(Menus.length).fill(false));
    };

    const handleClick = (index, redirect) => {
        setSelectedIndex(index);
        navigate(redirect);
    };

    return (
        <div
            className={`w-20 hover:w-72 bg-white shadow-xl min-h-screen p-5 pt-8 relative duration-500`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <ul className="relative">
                {Menus.map((Menu, index) => (
                    <li
                        onClick={() => handleClick(index, Menu.redirect)} 
                        key={index}
                        className={`flex rounded-md p-2 cursor-pointer hover:bg-gray-200 font-anton text-sm items-center gap-x-4 mt-3 ${index === selectedIndex ? "bg-gray-200" : ""}`}
                    >
                        <span>
                            {Menu.icon}
                        </span>
                        <span
                            className={`transition-all duration-250 ${showText[index] ? "animate-slideIn opacity-100" : "opacity-0"} origin-left text-lg ml-2 w-full`}
                            style={{ transitionDelay: `${index * 0.1}s` }}
                        >
                            {Menu.title}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

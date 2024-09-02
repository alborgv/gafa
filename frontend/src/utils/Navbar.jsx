import { useContext, useState, Fragment, useEffect, useRef } from 'react';
import { FaUserLarge, FaAngleDown } from "react-icons/fa6";
import { Menu, Transition } from '@headlessui/react';
import AuthContext from '../context/AuthContext';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import { Link } from 'react-router-dom';

import icon from '../assets/icono.svg'

export default function Navbar() {
    const { logoutUser, user } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = async () => {
        try {
            logoutUser();
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div>
            <nav className="bg-white shadow-sm px-4 py-3 flex justify-between">
                <Link to="/" className="flex items-center text-xl">
                    <img
                        src={icon}
                        className="w-12 h-12 cursor-pointer duration-500 ml-10 mr-3"
                    />
                    <span className="text-3xl font-anton font-bold">GAFA</span>
                </Link>
                <div className="flex items-center gap-x-5">
                    <div ref={menuRef}>
                        <Menu as="div" className="relative inline-block text-left rounded-full hover:bg-gray-100">
                            <div>
                                <Menu.Button onClick={handleClick} className="inline-flex w-full justify-center gap-x-1.5 px-3 py-2">
                                    <Badge color="success" variant="dot">
                                    <Avatar alt="Remy Sharp" src={`${user && user.profile ? user.profile : ""}`}>
                                        {user && user.usuario ? user.usuario[0] : ""}
                                    </Avatar>

                                    </Badge>

                                    <div className="flex flex-col text-left text-sm ml-3">
                                        <span className="font-anton font-semibold">{user.usuario}</span>
                                        <span className="font-anton">{user.email}</span>
                                    </div>

                                    <FaAngleDown
                                        color="black"
                                        className={`ml-2 mt-3 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                                    />
                                </Menu.Button>
                            </div>

                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="py-1">
                                        <Menu.Item>
                                            <a
                                                onClick={() => setShowModal(true)}
                                                className="cursor-pointer block px-4 py-2 text-sm hover:bg-gray-200 hover:text-black"
                                            >
                                                Cambiar contraseña
                                            </a>
                                        </Menu.Item>
                                        <Menu.Item>
                                            <a
                                                onClick={handleLogout}
                                                className="cursor-pointer block px-4 py-2 text-sm hover:bg-gray-100 hover:text-black"
                                            >
                                                Cerrar sesión
                                            </a>
                                        </Menu.Item>
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </div>
            </nav>
            <hr />
            <hr />
        </div>
    );
}

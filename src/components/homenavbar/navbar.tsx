// components/Navbar.tsx
"use client";

import {useState} from "react";
import Link from "next/link";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        {name: "Who We Are", href: "/about"},
        {name: "Our Methodology", href: "#methodology"},
        {name: "Buy Your Membership", href: "#membership"},
        {name: "Create an Account", href: "#create-account"},
    ];

    return (
        <nav className="bg-purple-600 text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    <div className="flex-shrink-0 text-2xl font-bold hover:text-purple-300 transition-colors">
                        <Link href="/">Kickster</Link>
                    </div>


                    <div className="hidden md:flex space-x-8 items-center">
                        {menuItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="relative text-lg font-medium px-2 py-1 group"
                            >
                                {item.name}
                                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-500 group-hover:w-full transition-all duration-300"></span>
                            </Link>
                        ))}
                    </div>

                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="focus:outline-none text-2xl"
                        >
                            {isOpen ? "✕" : "☰"}
                        </button>
                    </div>
                </div>
            </div>


            <div
                className={`md:hidden bg-purple-500 overflow-hidden transition-max-height duration-500 ${isOpen ? "max-h-96" : "max-h-0"
                    }`}
            >
                {menuItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="block px-6 py-3 hover:bg-gradient-to-r from-purple-400 to-pink-500 transition-colors text-white font-medium rounded-md mx-2 my-1"
                    >
                        {item.name}
                    </Link>
                ))}
            </div>
        </nav>
    );
}

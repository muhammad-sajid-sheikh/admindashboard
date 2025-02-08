"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (isLoggedIn) {
            router.push("/admin/dashboard");
        }
    }, [router]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        if (email === "muhammadsajid@gmail.com" && password === "sajid") {
            localStorage.setItem("isLoggedIn", "true");
            router.push("/admin/dashboard");
        } else {
            alert("Invalid email or password");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-green-400 to-teal-500">
            <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
                <div className="flex items-center justify-center mb-6">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={50}
                        height={50}
                        className="mr-3"
                    />
                    <h2 className="text-3xl font-bold text-teal-700">Admin Login</h2>
                </div>

                <div className="mb-6">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                        value={email}
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                        value={password}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                >
                    Login
                </button>
            </form>
        </div>
    );
}
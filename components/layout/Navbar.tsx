"use client";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const { status } = useSession();
	const isAuthenticated = status === "authenticated";
	const menuRef = useRef<HTMLDivElement>(null);

	// Close on scroll
	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Close menu on outside click
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}

		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [isOpen]);

	const navItems = [
		{ href: "/", label: "Home" },
		{ href: "/services", label: "Services" },
		{ href: "/packages", label: "Packages" },
		{ href: "/home-collection", label: "Home Collection" },
		{ href: "/faq", label: "FAQ" },
	];

	return (
		<motion.header
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			transition={{ duration: 0.6 }}
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
				isScrolled ? "bg-white/95 backdrop-blur-sm shadow-lg" : "bg-white/90"
			}`}
		>
			{/* Top bar */}
			<div className="bg-scanova-primary text-white py-2 px-4 ">
				<div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
					<div className="flex items-center gap-6">
						<div className="flex items-center gap-2">
							<Phone size={14} />
							<a href="tel:+919007204996" className="hover:underline">
								+91 90072 04996
							</a>
						</div>

						<div className="flex items-center gap-2">
							<Mail size={14} />
							<a
								href="mailto:info@scanovadiagnostics.com"
								className="hover:underline"
							>
								info@scanovadiagnostics.com
							</a>
						</div>
					</div>
					<div className="hidden md:block">
						<span>NABL Accredited | Free Home Collection Above ₹500</span>
					</div>
				</div>
			</div>

			{/* Main navigation */}
			<nav className="px-4 py-0">
				<div className="max-w-7xl mx-auto flex justify-between items-center">
					{/* Logo */}
					<Link href="/" className="flex items-center">
						<div className="flex items-center space-x-2 h-16 lg:h-28 md:h-20 overflow-hidden">
							<Image
								src="/logo.png"
								alt="Scanova Diagnostics Logo"
								height={200}
								width={200}
								className="object-contain h-full"
							/>
						</div>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden lg:flex items-center gap-8 text-base">
						{navItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className="text-scanova-text-body hover:text-scanova-primary transition-colors font-medium"
							>
								{item.label}
							</Link>
						))}

						{isAuthenticated ? (
							<div className="flex items-center gap-4">
								{/* About us */}
								<Link
									href="/about"
									className="flex items-center gap-2 text-scanova-text-body hover:text-scanova-primary font-medium"
								>
									<span>About </span>
								</Link>

								{/* Logout Button */}
								<Button
									variant="outline"
									onClick={() => signOut({ callbackUrl: "/login" })}
									className="text-base"
								>
									Logout
								</Button>
							</div>
						) : (
							<Link
								href="/login"
								className="text-scanova-text-body hover:text-scanova-primary transition-colors font-medium"
							>
								Login
							</Link>
						)}

						<Link href="/contact">
							<Button className="bg-scanova-gradient hover:opacity-90 text-white text-base">
								Contact
							</Button>
						</Link>

						<Link href="/home-collection">
							<Button className="bg-scanova-gradient hover:opacity-90 text-white text-base">
								Book Now
							</Button>
						</Link>
					</div>

					{/* Mobile menu button */}
					<button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2">
						{isOpen ? <X size={24} /> : <Menu size={24} />}
					</button>
				</div>

				{/* Mobile Navigation */}
				{isOpen && (
					<motion.div
						ref={menuRef}
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className="lg:hidden mt-3 pb-6 px-4 bg-white shadow-lg rounded-xl border mx-3"
					>
						<div className="flex flex-col gap-3 pt-4">
							{navItems.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									onClick={() => setIsOpen(false)}
									className="px-4 py-2 rounded-lg text-scanova-text-body hover:bg-gray-100 hover:text-scanova-primary transition-colors font-medium"
								>
									{item.label}
								</Link>
							))}

							<div className="border-t my-3"></div>

							{isAuthenticated ? (
								<Button
									variant="outline"
									onClick={() => {
										setIsOpen(false);
										signOut({ callbackUrl: "/login" });
									}}
									className="w-full rounded-lg py-2 text-scanova-text-body hover:text-red-500 hover:border-red-500 transition"
								>
									Logout
								</Button>
							) : (
								<Link
									href="/login"
									onClick={() => setIsOpen(false)}
									className="px-4 py-2 rounded-lg text-scanova-text-body hover:bg-gray-100 hover:text-scanova-primary transition-colors font-medium"
								>
									Login
								</Link>
							)}

							<Link href="/home-collection" onClick={() => setIsOpen(false)}>
								<Button className="w-full mt-2 bg-scanova-gradient hover:opacity-90 text-white rounded-lg py-2">
									Book Now
								</Button>
							</Link>

							<Link href="/contact" onClick={() => setIsOpen(false)}>
								<Button className="w-full mt-2 bg-scanova-gradient hover:opacity-90 text-white rounded-lg py-2">
									Contact
								</Button>
							</Link>
						</div>
					</motion.div>
				)}
			</nav>
		</motion.header>
	);
}

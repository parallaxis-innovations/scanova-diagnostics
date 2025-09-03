"use client";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { useState, useEffect } from "react";
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

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

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
								src="/logo (1).png"
								alt="Scanova Diagnostics Logo"
								height={200} // Keep these for the image's natural size
								width={200}
								className="object-contain h-full"
							/>
						</div>
					</Link>

					{/* Desktop Navigation */}
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
								{/* Profile Page Link */}
								<Link
									href="/profile"
									className="flex items-center gap-2 text-scanova-text-body hover:text-scanova-primary font-medium"
								>
									<Image
										src="/default-avatar.png" // replace with session.user.image if you have it
										alt="Profile"
										width={32}
										height={32}
										className="rounded-full border"
									/>
									<span>Profile</span>
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
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="lg:hidden mt-4 pb-4 border-t"
					>
						<div className="flex flex-col gap-4 pt-4">
							{navItems.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									onClick={() => setIsOpen(false)}
									className="text-scanova-text-body hover:text-scanova-primary transition-colors font-medium"
								>
									{item.label}
								</Link>
							))}
							{isAuthenticated ? (
								<Button
									variant="outline"
									onClick={() => {
										setIsOpen(false);
										signOut({ callbackUrl: "/login" });
									}}
								>
									Logout
								</Button>
							) : (
								<Link
									href="/login"
									onClick={() => setIsOpen(false)}
									className="text-scanova-text-body hover:text-scanova-primary transition-colors font-medium"
								>
									Login
								</Link>
							)}
							<Link href="/home-collection">
								<Button className="bg-scanova-gradient hover:opacity-90 text-white">
									Book Now
								</Button>
							</Link>
						</div>
					</motion.div>
				)}
			</nav>
		</motion.header>
	);
}

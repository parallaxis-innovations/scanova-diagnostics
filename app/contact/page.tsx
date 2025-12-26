"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Calendar, Home, Stethoscope, Heart, Shield, Award } from "lucide-react";
import Link from "next/link";
import Head from "next/head";

export default function ContactPage() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		message: "",
	});
	const [status, setStatus] = useState("");
	const [loading, setLoading] = useState(false);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => setFormData({ ...formData, [e.target.name]: e.target.value });

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setStatus("");

		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			if (res.ok) {
				setStatus("✅ Message sent successfully!");
				setFormData({ name: "", email: "", phone: "", message: "" });
			} else {
				setStatus("❌ Failed to send. Try again later.");
			}
		} catch {
			setStatus("⚠️ Network error. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleHomeCollection = () => {
		// Replace with your actual home collection booking page route
		window.location.href = "/book-home-collection";
	};

	return (
		<>
			<Head>
				{/* Event snippet for Contact conversion page */}
				<script dangerouslySetInnerHTML={{
					__html: `
						gtag('event', 'conversion', {'send_to': 'AW-17829303039/VLFgCJXb7NYbEP-l1rVC'});
					`
				}} />
			</Head>
			<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 mt-12">
				<div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
					<div className="flex flex-col lg:flex-row min-h-[700px]">
						{/* Left Panel - Redesigned */}
						<motion.div
							className="lg:w-1/2 bg-gradient-to-br from-cyan-600 to-cyan-800 text-white p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden"
							initial={{ opacity: 0, x: -50 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8 }}
						>
							{/* Enhanced Background Pattern */}
							<div className="absolute inset-0 opacity-10">
								<div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-xl"></div>
								<div className="absolute bottom-20 right-10 w-48 h-48 bg-cyan-300 rounded-full blur-2xl"></div>
								<div className="absolute top-1/2 right-1/4 w-24 h-24 bg-cyan-200 rounded-full blur-lg"></div>
							</div>

							<div className="relative z-10">
								{/* Professional Header with Icons */}
								<motion.div
									className="text-center mb-8"
									initial={{ opacity: 0, y: 30 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.8, delay: 0.1 }}
								>
									{/* Medical Icons Grid */}
									<div className="grid grid-cols-3 gap-4 mb-8 max-w-xs mx-auto">
										<motion.div
											className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm"
											whileHover={{ scale: 1.1, rotate: 5 }}
											transition={{ type: "spring", stiffness: 300 }}
										>
											<Stethoscope className="w-10 h-10 text-white" />
										</motion.div>
										<motion.div
											className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm"
											whileHover={{ scale: 1.1, rotate: -5 }}
											transition={{ type: "spring", stiffness: 300 }}
										>
											<Heart className="w-10 h-10 text-white" />
										</motion.div>
										<motion.div
											className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm"
											whileHover={{ scale: 1.1, rotate: 5 }}
											transition={{ type: "spring", stiffness: 300 }}
										>
											<Shield className="w-10 h-10 text-white" />
										</motion.div>
									</div>

									{/* NABL Accreditation Badge */}
									<motion.div
										className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
										initial={{ opacity: 0, scale: 0.9 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ duration: 0.6, delay: 0.3 }}
									>
										<Award className="w-5 h-5 text-cyan-200" />
										<span className="text-sm font-semibold text-cyan-100">NABL Accredited</span>
									</motion.div>
								</motion.div>

								<motion.div
									initial={{ opacity: 0, y: 30 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.8, delay: 0.4 }}
								>
									<h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
										Get in Touch with
										<span className="block text-cyan-200">Scanova Diagnostics</span>
									</h1>
									<p className="text-lg text-cyan-100 mb-8 leading-relaxed">
										Your trusted partner in healthcare diagnostics, combining cutting-edge technology with compassionate, patient-first service.
									</p>

									{/* Enhanced Contact Info */}
									<motion.div
										className="space-y-5"
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.6, delay: 0.6 }}
									>
										<motion.div
											className="flex items-center space-x-4 p-3 bg-white/10 rounded-xl backdrop-blur-sm"
											whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.15)" }}
											transition={{ type: "spring", stiffness: 300 }}
										>
											<div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center">
												<Phone className="w-5 h-5 text-white" />
											</div>
											<div>
												<p className="text-cyan-200 text-sm font-medium">Call Us</p>
												<p className="text-white font-semibold">+91-90072 04996</p>
											</div>
										</motion.div>

										<motion.div
											className="flex items-center space-x-4 p-3 bg-white/10 rounded-xl backdrop-blur-sm"
											whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.15)" }}
											transition={{ type: "spring", stiffness: 300 }}
										>
											<div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center">
												<Mail className="w-5 h-5 text-white" />
											</div>
											<div>
												<p className="text-cyan-200 text-sm font-medium">Email Us</p>
												<p className="text-white font-semibold">info@scanovadiagnostics.com</p>
											</div>
										</motion.div>

										<motion.div
											className="flex items-start space-x-4 p-3 bg-white/10 rounded-xl backdrop-blur-sm"
											whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.15)" }}
											transition={{ type: "spring", stiffness: 300 }}
										>
											<div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
												<MapPin className="w-5 h-5 text-white" />
											</div>
											<div>
												<p className="text-cyan-200 text-sm font-medium">Visit Us</p>
												<p className="text-white font-semibold leading-relaxed">
													62 GT Road, Opp. National Hotel<br />
													Howrah, 711101, West Bengal
												</p>
											</div>
										</motion.div>
									</motion.div>
								</motion.div>
							</div>
						</motion.div>

						{/* Right Panel - Contact Form */}
						<motion.div
							className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center"
							initial={{ opacity: 0, x: 50 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8, delay: 0.2 }}
						>
							<div className="max-w-md mx-auto w-full">
								<div className="text-center mb-8">
									<h2 className="text-3xl font-bold text-gray-900 mb-2">
										Send a Message
									</h2>
									<p className="text-gray-600">
										Enter your details to get in touch with us
									</p>
								</div>

								<form onSubmit={handleSubmit} className="space-y-6">
									<div>
										<Input
											name="name"
											placeholder="Your Name"
											value={formData.name}
											onChange={handleChange}
											className="h-12 border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
											required
										/>
									</div>

									<div>
										<Input
											type="email"
											name="email"
											placeholder="Your Email"
											value={formData.email}
											onChange={handleChange}
											className="h-12 border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
											required
										/>
									</div>

									<div>
										<Input
											type="tel"
											name="phone"
											placeholder="Your Phone"
											value={formData.phone}
											onChange={handleChange}
											className="h-12 border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
										/>
									</div>

									<div>
										<Textarea
											name="message"
											placeholder="Your Message"
											value={formData.message}
											onChange={handleChange}
											className="min-h-[120px] border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
											required
										/>
									</div>

									<Button
										type="submit"
										className="w-full h-12 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg transition-colors"
										disabled={loading}
									>
										{loading ? "Sending..." : "Send Message"}
									</Button>

									{status && <p className="text-center text-sm mt-2">{status}</p>}
								</form>

								{/* Home Collection Section */}
								<div className="mt-8 pt-8 border-t border-gray-200">
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.6, delay: 0.5 }}
										className="text-center"
									>
										<div className="mb-4">
											<div className="w-16 h-16 bg-cyan-100 rounded-full mx-auto flex items-center justify-center mb-4">
												<Home className="w-8 h-8 text-cyan-600" />
											</div>
											<h3 className="text-xl font-semibold text-gray-900 mb-2">
												Home Collection Service
											</h3>
											<p className="text-gray-600 mb-6">
												Book a convenient home collection appointment for your
												diagnostic tests. Our certified professionals will visit
												your home at your preferred time.
											</p>
										</div>

										<Button
											asChild
											className="w-full h-12 bg-white border-2 border-cyan-600 text-cyan-600 hover:bg-cyan-50 font-semibold rounded-lg transition-colors flex items-center justify-center space-x-2"
										>
											<Link href="/home-collection">
												<Calendar className="w-5 h-5" />
												<span>Book Home Collection</span>
											</Link>
										</Button>
									</motion.div>
								</div>

								{/* Quick Links */}
								<div className="mt-6 grid grid-cols-2 gap-4">
									{/* Call Support */}
									<motion.a
										whileHover={{ scale: 1.05 }}
										href="tel:9007204996"
										className="text-center p-4 bg-gray-50 rounded-lg cursor-pointer transition-transform block"
									>
										<Phone className="w-6 h-6 text-cyan-600 mx-auto mb-2" />
										<p className="text-sm font-medium text-gray-700">
											Call Support
										</p>
										<p className="text-xs text-gray-500">+91 90072 04996</p>
									</motion.a>

									{/* Email Us */}
									<motion.a
										whileHover={{ scale: 1.05 }}
										href="mailto:info@scanovadiagnostics.com"
										className="text-center p-4 bg-gray-50 rounded-lg cursor-pointer transition-transform block"
									>
										<Mail className="w-6 h-6 text-cyan-600 mx-auto mb-2" />
										<p className="text-sm font-medium text-gray-700">Email Us</p>
										<p className="text-xs text-gray-500">
											info@scanovadiagnostics.com
										</p>
									</motion.a>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</div>
		</>
	);
}
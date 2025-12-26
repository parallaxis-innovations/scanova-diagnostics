"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Mail,
	Phone,
	Lock,
	User,
	Download,
	Calendar,
	FileText,
	Settings,
	MapPinHouse,
	UserPen,
	UserCheck,
	HeartPulse,
} from "lucide-react";
import Image from "next/image";

export default function SignupPage() {
	const [formData, setFormData] = useState({
  full_name: "",
  email_id: "",
  phone_number: "",
  password: "",
  address: "",
  age: "",
  gender: "",
  blood_group: "",
  agree: false,
});


	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/\D/g, "");

		if (value.length > 10) return;

		setFormData({ ...formData, phone_number: value });

		if (value.length !== 10) {
			setError("Phone number must be exactly 10 digits");
		} else {
			setError("");
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value, type, checked } = e.target;
		setFormData({
			...formData,
			[id]: type === "checkbox" ? checked : value,
		});
	};

	console.log("DEBUG SEND", formData);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		if (!formData.agree) {
			setError("You must agree to the Terms of Service and Privacy Policy");
			return;
		}

		try {
			const res = await fetch("/api/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					full_name: formData.full_name,
					email_id: formData.email_id,
					phone_number: formData.phone_number,
					password: formData.password,
					address: formData.address,
					age: formData.age,
					gender: formData.gender,
					blood_group: formData.blood_group,
				}),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.message || "Something went wrong");
			}

			setSuccess("Account created successfully! Redirecting to login...");
			setTimeout(() => router.push("/login"), 2000);
		} catch (err: any) {
			setError(err.message);
		}
	};

	const fadeUpVariant = {
		hidden: { opacity: 0, y: 30 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-6 py-12">
			<motion.div
				variants={fadeUpVariant}
				initial="hidden"
				animate="visible"
				className="w-full max-w-5xl flex flex-col md:flex-row bg-white shadow-xl rounded-2xl overflow-hidden"
			>
				<div className="relative w-full md:w-1/2 bg-scanova-primary flex flex-col justify-end p-8 text-white">
					<Image
						src="/login-2.png"
						alt="Welcome to Scanova Diagnostics"
						fill
						className="object-cover opacity-90"
					/>
					<div className="absolute inset-0 bottom-0 bg-gradient-to-t from-[#0E7AA4] via-[#1E517C]/30 to-transparent z-10 pointer-events-none"></div>
					<div className="relative z-20">
						<h1 className="text-3xl font-bold mb-2">
							Welcome to Scanova Diagnostics
						</h1>
						<p className="text-sm leading-relaxed text-gray-200">
							Scanova Diagnostics—a NABL-accredited lab combining cutting-edge
							technology with compassionate, patient-first service.
						</p>
					</div>
				</div>

				<div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
					<div className="border-0 shadow-none">
						<div className="space-y-1 text-center">
							<h2 className="text-3xl font-semibold text-gray-800">
								Create Your Account
							</h2>
							<p className="text-gray-500 text-sm">
								Enter your details to get started
							</p>
							{error && <p className="text-red-500 text-sm">{error}</p>}
							{success && <p className="text-green-500 text-sm">{success}</p>}
						</div>
						<div className="mt-6">
							<form onSubmit={handleSubmit} className="space-y-5">
								<div>
									<Label htmlFor="name">Full Name</Label>
									<div className="relative mt-1">
										<Input
											id="full_name"
											type="text"
											value={formData.full_name}
											onChange={handleChange}
											placeholder="Enter your full name"
											className="pl-10 h-12"
											required
										/>
										<User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
									</div>
								</div>

								<div>
									<Label htmlFor="email">Email Address</Label>
									<div className="relative mt-1">
										<Input
											id="email_id"
											type="email"
											value={formData.email_id}
											onChange={handleChange}
											placeholder="Enter your email"
											className="pl-10 h-12"
											required
										/>
										<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
									</div>
								</div>

								<div>
									<Label htmlFor="phone_number">Phone Number</Label>
									<div className="relative mt-1">
										<Input
											id="phone_number"
											type="tel"
											value={formData.phone_number}
											onChange={handlePhoneChange}
											placeholder="Enter your phone number"
											className="pl-10 h-12"
										/>
										<Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
									</div>
									{error && (
										<p className="text-red-500 text-sm mt-1">{error}</p>
									)}
								</div>

								<div>
									<Label htmlFor="password">Password</Label>
									<div className="relative mt-1">
										<Input
											id="password"
											type="password"
											value={formData.password}
											onChange={handleChange}
											placeholder="Enter your password"
											className="pl-10 h-12"
											required
										/>
										<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
									</div>
								</div>

								<div>
									<Label htmlFor="address">Address</Label>
									<div className="relative mt-1">
										<Input
											id="address"
											type="text"
											value={formData.address}
											onChange={handleChange}
											placeholder="Enter your address"
											className="pl-10 h-12"
											required
										/>
										<MapPinHouse className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
									</div>
								</div>

								<div>
									<Label htmlFor="age">Age</Label>
									<div className="relative mt-1">
										<Input
											id="age"
											type="number"
											value={formData.age}
											onChange={handleChange}
											placeholder="Enter your age"
											className="pl-10 h-12"
											required
										/>
										<UserPen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
									</div>
								</div>

								<div>
									<Label htmlFor="gender">Gender</Label>
									<div className="relative mt-1">
										<select
											id="gender"
											value={formData.gender}
											onChange={(e) =>
												setFormData({ ...formData, gender: e.target.value })
											}
											className="pl-9 pr-3 h-12 w-full border rounded-lg"
											required
										>
											<option value="">Select Gender</option>
											<option value="Male">Male</option>
											<option value="Female">Female</option>
											<option value="Other">Other</option>
										</select>
										<UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
									</div>
								</div>

								<div>
									<Label htmlFor="blood_group">Blood Group</Label>
									<div className="relative mt-1">
										<select
											id="blood_group"
											value={formData.blood_group}
											onChange={(e) =>
												setFormData({
													...formData,
													blood_group: e.target.value,
												})
											}
											className="pl-9 pr-3 h-12 w-full border rounded-lg"
											required
										>
											<option value="">Select Blood Group</option>
											<option value="A+">A+</option>
											<option value="A-">A-</option>
											<option value="B+">B+</option>
											<option value="B-">B-</option>
											<option value="O+">O+</option>
											<option value="O-">O-</option>
											<option value="AB+">AB+</option>
											<option value="AB-">AB-</option>
										</select>
										<HeartPulse className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
									</div>
								</div>

								<div className="flex items-center space-x-2">
									<Checkbox
										id="agree"
										checked={formData.agree}
										onCheckedChange={(v) =>
											setFormData({ ...formData, agree: !!v })
										}
									/>
									<Label htmlFor="agree" className="text-sm text-gray-600">
										I agree to the{" "}
										<Link
											href="/terms-conditions"
											className="text-scanova-primary underline"
										>
											Terms of Service
										</Link>{" "}
										and{" "}
										<Link
											href="/privacy-policy"
											className="text-scanova-primary underline"
										>
											Privacy Policy
										</Link>
									</Label>
								</div>

								<Button
									type="submit"
									className="w-full bg-gradient-to-r from-scanova-dark-blue to-scanova-primary hover:opacity-90 text-white h-12 text-lg font-medium rounded-lg"
								>
									Sign Up
								</Button>
							</form>

							<p className="mt-6 text-sm text-center text-gray-600">
								Already have an account?{" "}
								<Link
									href="/login"
									className="text-scanova-primary font-medium"
								>
									Log In
								</Link>
							</p>

							<div className="mt-8 grid grid-cols-2 gap-4">
								{[
									{ icon: Download, text: "Download Reports" },
									{ icon: Calendar, text: "Track Appointments" },
									{ icon: FileText, text: "Health History" },
									{ icon: Settings, text: "Manage Profile" },
								].map(({ icon: Icon, text }) => (
									<div
										key={text}
										className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition"
									>
										<Icon className="w-5 h-5 text-scanova-primary" />
										<span className="text-gray-700 text-sm">{text}</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</motion.div>
		</div>
	);
}

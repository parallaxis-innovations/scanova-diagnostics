"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
	CheckCircle,
	Home,
	Stethoscope,
	Calendar,
	Award,
	Users,
	FlaskConical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import TestimonialSlider from "@/components/ui/TestimonialSlider";

export default function HomePage() {
	const fadeUpVariant = {
		hidden: { opacity: 0, y: 30 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
	};

	const staggerContainer = {
		hidden: {},
		visible: { transition: { staggerChildren: 0.1 } },
	};

	const services = [
		{
			icon: <FlaskConical className="w-8 h-8 text-scanova-primary" />,
			title: "Quick Home Collection",
			description:
				"Quick, safe sample pickup at your location with trained professionals.",
		},
		{
			icon: <Stethoscope className="w-8 h-8 text-scanova-primary" />,
			title: "Comprehensive Lab & Imaging",
			description:
				"From pathology to CT, MRI, and ultrasound - complete diagnostic solutions.",
		},
		{
			icon: <Calendar className="w-8 h-8 text-scanova-primary" />,
			title: "Health Packages",
			description:
				"Preventive care bundled for convenience and savings with expert guidance.",
		},
		{
			icon: <Users className="w-8 h-8 text-scanova-primary" />,
			title: "Doctor Consultations",
			description:
				"Virtual and in-person expert guidance from qualified medical professionals.",
		},
	];

	const trustPillars = [
		{
			icon: <Award className="w-12 h-12 text-scanova-teal" />,
			title: "Advanced Laboratory Standards",
			description:
				"Our NABL accreditation ensures reliable testing and rapid turnaround times.",
		},
		{
			icon: <Home className="w-12 h-12 text-scanova-teal" />,
			title: "Seamless Home Diagnostics",
			description:
				"Book from home—our phlebotomists come equipped with portable ECG, X-Ray, and Holter devices.",
		},
		{
			icon: <CheckCircle className="w-12 h-12 text-scanova-teal" />,
			title: "Decade of Proven Excellence",
			description:
				"Trusted by thousands—Scanova builds on over 10+ years of diagnostic excellence across multiple care centers.",
		},
	];

	const packages = [
		{
			title: "Heart & Diabetes Check",
			price: "₹2,499",
			originalPrice: "₹3,500",
			tests: "25+ Tests",
			description: "Lipid Panel, Blood Sugar, Kidney & Liver Function, Thyroid",
			popular: true,
		},
		{
			title: "Women's Wellness",
			price: "₹3,299",
			originalPrice: "₹4,200",
			tests: "30+ Tests",
			description:
				"Hormonal assays, Vitamin D, CBC, Iron Profile - tailored for women's health",
		},
		{
			title: "Senior Health",
			price: "₹4,999",
			originalPrice: "₹6,500",
			tests: "40+ Tests",
			description:
				"CBC, Vitamin D, Bone Density (DEXA), Cardiac markers - ideal for aging wellness",
		},
	];

	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-scanova-primary/10 to-scanova-teal/10 overflow-hidden mt-12">
				{/* Background Pattern */}
				<div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1666214277657-e60f05c40b04?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZG9jdG9yc3xlbnwwfHwwfHx8MA%3D%3D')] bg-cover bg-center">
					<div className="absolute inset-0 bg-hero-pattern"></div>
				</div>

				<div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
					>
						<h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
							Accurate Diagnostics & Care
							<span className="block text-white">
								Delivered to Your Door
							</span>
						</h1>
						<p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
							Scanova Diagnostics—a NABL-accredited lab combining cutting-edge
							technology with compassionate, patient-first service.
						</p>

						<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
							<Link href="/home-collection">
								<Button
									size="lg"
									className="bg-teal-gradient hover:opacity-90 text-white px-8 py-4 text-lg"
								>
									Book Home Test
								</Button>
							</Link>

							<Link href="/packages">
								<Button
									size="lg"
									variant="outline"
									className="border-white hover:bg-white text-scanova-primary px-8 py-4 text-lg"
								>
									View Packages
								</Button>
							</Link>
						</div>
					</motion.div>
				</div>

				{/* Scroll indicator */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1, duration: 0.5 }}
					className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
				>
					<div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
						<motion.div
							animate={{ y: [0, 12, 0] }}
							transition={{ repeat: Infinity, duration: 1.5 }}
							className="w-1 h-3 bg-white rounded-full mt-2"
						/>
					</div>
				</motion.div>
			</section>

			{/* Trust Pillars Section */}
			<section className="py-20 bg-white">
				<div className="max-w-7xl mx-auto px-4">
					<motion.div
						variants={fadeUpVariant}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
						className="text-center mb-16"
					>
						<h2 className="text-3xl md:text-4xl font-bold text-scanova-text-header mb-4">
							Why Trust Scanova Diagnostics?
						</h2>
						<p className="text-lg text-scanova-text-body max-w-2xl mx-auto">
							Three key pillars that make us your trusted healthcare partner
						</p>
					</motion.div>

					<motion.div
						variants={staggerContainer}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
						className="grid grid-cols-1 md:grid-cols-3 gap-8"
					>
						{trustPillars.map((pillar, index) => (
							<motion.div key={index} variants={fadeUpVariant}>
								<Card className="text-center p-6 hover:shadow-lg transition-all duration-300 border-t-4 border-t-scanova-teal lg:h-[350px] md:h-[300px] h-[300px]">
									<CardHeader>
										<div className="mx-auto mb-4">{pillar.icon}</div>
										<CardTitle className="text-xl text-scanova-text-header">
											{pillar.title}
										</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-scanova-text-body">
											{pillar.description}
										</p>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</motion.div>
				</div>
			</section>

			{/* Services Overview */}
			<section className="py-20 bg-gray-50">
				<div className="max-w-7xl mx-auto px-4">
					<motion.div
						variants={fadeUpVariant}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
						className="text-center mb-16"
					>
						<h2 className="text-3xl md:text-4xl font-bold text-scanova-text-header mb-4">
							Our Services at a Glance
						</h2>
						<p className="text-lg text-scanova-text-body max-w-2xl mx-auto">
							Comprehensive healthcare solutions delivered with precision and
							care
						</p>
					</motion.div>

					<motion.div
						variants={staggerContainer}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
						className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
					>
						{services.map((service, index) => (
							<motion.div key={index} variants={fadeUpVariant}>
								<Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
									<CardHeader className="text-center pb-4">
										<div className="mx-auto mb-4 p-3 bg-scanova-primary/10 rounded-full w-fit">
											{service.icon}
										</div>
										<CardTitle className="text-lg text-scanova-text-header">
											{service.title}
										</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-scanova-text-body text-center text-sm">
											{service.description}
										</p>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</motion.div>

					<motion.div
						variants={fadeUpVariant}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
						className="text-center mt-12"
					>

          <Link href="/services">
						<Button
							size="lg"
							className="bg-scanova-gradient hover:opacity-90 text-white"
						>
							View All Services
						</Button>
            </Link>
					</motion.div>
				</div>
			</section>

			{/* Counters Section */}
			<section className="py-20 bg-scanova-gradient text-white">
				<div className="max-w-7xl mx-auto px-4">
					<motion.div
						variants={staggerContainer}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
						className="grid grid-cols-1 md:grid-cols-3 gap-8"
					>
						<motion.div variants={fadeUpVariant} className="text-center">
							<AnimatedCounter end={50000} suffix="+" />
							<h3 className="text-xl font-semibold mb-2">Patients Served</h3>
							<p className="text-white/80">Trust placed in our expertise</p>
						</motion.div>

						<motion.div variants={fadeUpVariant} className="text-center">
							<AnimatedCounter end={200000} suffix="+" />
							<h3 className="text-xl font-semibold mb-2">Tests Completed</h3>
							<p className="text-white/80">Accurate diagnostics delivered</p>
						</motion.div>

						<motion.div variants={fadeUpVariant} className="text-center">
							<AnimatedCounter end={10} suffix="+" />
							<h3 className="text-xl font-semibold mb-2">
								Years of Excellence
							</h3>
							<p className="text-white/80">Proven track record in healthcare</p>
						</motion.div>
					</motion.div>
				</div>
			</section>

			{/* Featured Packages */}
			<section className="py-20 bg-white">
				<div className="max-w-7xl mx-auto px-4">
					<motion.div
						variants={fadeUpVariant}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
						className="text-center mb-16"
					>
						<h2 className="text-3xl md:text-4xl font-bold text-scanova-text-header mb-4">
							Featured Health Packages
						</h2>
						<p className="text-lg text-scanova-text-body max-w-2xl mx-auto">
							Comprehensive health screening packages designed by medical
							experts
						</p>
					</motion.div>

					<motion.div
						variants={staggerContainer}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
						className="grid grid-cols-1 md:grid-cols-3 gap-8"
					>
						{packages.map((pkg, index) => (
							<motion.div key={index} variants={fadeUpVariant}>
								<Card
									className={`h-full hover:shadow-lg transition-all duration-300 ${
										pkg.popular ? "border-scanova-teal border-2 relative" : ""
									}`}
								>
									{pkg.popular && (
										<div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-scanova-teal text-white px-4 py-1 rounded-full text-sm font-medium">
											Most Popular
										</div>
									)}
									<CardHeader className="text-center">
										<CardTitle className="text-xl text-scanova-text-header mb-2">
											{pkg.title}
										</CardTitle>
										<div className="flex items-center justify-center gap-2">
											<span className="text-3xl font-bold text-scanova-primary">
												{pkg.price}
											</span>
											<span className="text-lg text-gray-500 line-through">
												{pkg.originalPrice}
											</span>
										</div>
										<p className="text-scanova-teal font-medium">{pkg.tests}</p>
									</CardHeader>
									<CardContent className="text-center">
										<p className="text-scanova-text-body mb-6">
											{pkg.description}
										</p>
                    <Link href="/packages">
										<Button className="w-full bg-scanova-gradient hover:opacity-90 text-white">
											Book Package
										</Button>
                    </Link>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</motion.div>

					<motion.div
						variants={fadeUpVariant}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
						className="text-center mt-12"
					>
          
          <Link href="/packages">
						<Button
							size="lg"
							variant="outline"
							className="border-scanova-primary text-scanova-primary hover:bg-scanova-primary hover:text-white"
						>
							View All Packages
						</Button>
          </Link>
					</motion.div>
				</div>
			</section>

			{/* Testimonials */}
			<section className="py-20 bg-gray-50">
				<div className="max-w-7xl mx-auto px-4">
					<motion.div
						variants={fadeUpVariant}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
						className="text-center mb-12"
					>
						<h2 className="text-3xl md:text-4xl font-bold text-scanova-text-header mb-4">
							What Our Patients Say
						</h2>
						<p className="text-lg text-scanova-text-body max-w-2xl mx-auto">
							Real experiences from real patients who trust us with their health
						</p>
					</motion.div>

					<motion.div
						variants={fadeUpVariant}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
					>
						<TestimonialSlider />
					</motion.div>
				</div>
			</section>

			{/* Final CTA */}
			<section className="py-20 bg-scanova-gradient text-white">
				<div className="max-w-4xl mx-auto px-4 text-center">
					<motion.div
						variants={fadeUpVariant}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
					>
						<h2 className="text-3xl md:text-4xl font-bold mb-6">
							Book Your Free Home Collection Today
						</h2>
						<p className="text-xl text-white/90 mb-8">
							Experience hassle-free diagnostics with our professional home
							collection service. Free for orders above ₹500.
						</p>

            <Link href="/home-collection">
						<Button
							size="lg"
							className="bg-white text-scanova-primary hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
						>
							Schedule Collection Now
						</Button>
            </Link>
					</motion.div>
				</div>
			</section>
		</div>
	);
}

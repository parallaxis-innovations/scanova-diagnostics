"use client";
import Link from "next/link";

import { motion } from "framer-motion";
import {
	FlaskConical,
	Heart,
	Brain,
	Scan,
	Microscope,
	Activity,
	Eye,
	Bone,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ServicesPage() {
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
			icon: <FlaskConical className="w-12 h-12 text-scanova-teal" />,
			title: "Pathology (Lab Tests)",
			description:
				"Comprehensive laboratory testing with accurate results and quick turnaround",
			tests: [
				"Hematology - Complete Blood Count (CBC), ESR, Platelet Count",
				"Biochemistry - Liver Function, Kidney Function, Lipid Profile",
				"Hormonal Panels - Thyroid, Diabetes, Reproductive Hormones",
				"Infection Testing - Hepatitis, HIV, Malaria, Typhoid",
				"Histopathology - Tissue examination and biopsy analysis",
				"Cytogenetics - Chromosomal analysis and genetic testing",
			],
			highlights: [
				"NABL accredited laboratory",
				"Same-day reports for routine tests",
				"Advanced automated analyzers",
				"Quality control at every step",
			],
		},
		{
			icon: <Scan className="w-12 h-12 text-scanova-teal" />,
			title: "Medical Imaging",
			description: "State-of-the-art imaging technology for accurate diagnosis",
			tests: [
				"X-Ray - Digital radiography with instant results",
				"Ultrasound (USG) - Abdominal, Pelvic, Cardiac, Obstetric",
				"CT Scan - Multi-slice computed tomography",
				"MRI - Magnetic resonance imaging for detailed soft tissue analysis",
				"DEXA Scan - Bone density measurement",
				"Mammography - Breast cancer screening",
			],
			highlights: [
				"Digital imaging with enhanced clarity",
				"Reports within 30 minutes for X-Ray/USG",
				"Radiation safety protocols",
				"Expert radiologist interpretation",
			],
		},
		{
			icon: <Heart className="w-12 h-12 text-scanova-teal" />,
			title: "Cardiology Diagnostics",
			description: "Comprehensive cardiac testing for heart health assessment",
			tests: [
				"ECG - Electrocardiogram for heart rhythm analysis",
				"TMT - Treadmill test for cardiac stress evaluation",
				"2D Echocardiogram - Heart structure and function assessment",
				"Holter Monitoring - 24-hour continuous heart monitoring",
				"Doppler Studies - Blood flow analysis in arteries and veins",
			],
			highlights: [
				"Portable ECG available for home visits",
				"Experienced cardiac technicians",
				"Immediate preliminary reports",
				"Cardiologist consultation available",
			],
		},
		{
			icon: <Brain className="w-12 h-12 text-scanova-teal" />,
			title: "Neurology Diagnostics",
			description:
				"Specialized testing for neurological conditions and disorders",
			tests: [
				"EEG - Electroencephalogram for brain activity monitoring",
				"EMG - Electromyography for muscle function testing",
				"NCV - Nerve conduction velocity studies",
			],
			highlights: [
				"Advanced neurological equipment",
				"Experienced neurophysiology technicians",
				"Comfortable testing environment",
				"Detailed analysis and reporting",
			],
		},
	];

	const specialFeatures = [
		{
			icon: <Activity className="w-8 h-8 text-scanova-primary" />,
			title: "Digital Radiology",
			description:
				"Reduce wait time—reports available within 30 minutes for X-Ray/CT imaging.",
		},
		{
			icon: <Microscope className="w-8 h-8 text-scanova-primary" />,
			title: "Advanced Laboratory",
			description:
				"Automated analyzers and quality control systems ensure accurate results.",
		},
		{
			icon: <Eye className="w-8 h-8 text-scanova-primary" />,
			title: "Expert Analysis",
			description:
				"All reports reviewed by qualified pathologists and radiologists.",
		},
		{
			icon: <Bone className="w-8 h-8 text-scanova-primary" />,
			title: "Comprehensive Record Access",
			description:
				"Your health history saved safely—view trends over the years with digital access.",
		},
	];

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Hero Section */}
			<section className="bg-scanova-gradient text-white py-20">
				<div className="max-w-7xl mx-auto px-4">
					<motion.div
						variants={fadeUpVariant}
						initial="hidden"
						animate="visible"
						className="text-center"
					>
						<h1 className="text-4xl md:text-5xl font-bold mb-6">
							Diagnostic Services at Scanova Diagnostics
						</h1>
						<p className="text-xl text-white/90 mb-8 max-w-4xl mx-auto">
							We offer a full suite of diagnostic modalities under one
							roof—backed by advanced equipment, expert technicians, and quality
							reporting.
						</p>
						<Button
							asChild
							size="lg"
							className="bg-white text-scanova-primary hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
						>
							<Link href="/packages">Book Your Test Now</Link>
						</Button>
					</motion.div>
				</div>
			</section>

			{/* Main Services */}
			<section className="py-20 bg-white">
				<div className="max-w-7xl mx-auto px-4">
					<motion.div
						variants={staggerContainer}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
						className="space-y-16"
					>
						{services.map((service, index) => (
							<motion.div key={index} variants={fadeUpVariant}>
								<Card className="hover:shadow-lg transition-all duration-300">
									<CardHeader>
										<div className="flex items-center gap-4 mb-4">
											<div className="p-3 bg-scanova-teal/10 rounded-lg">
												{service.icon}
											</div>
											<div>
												<CardTitle className="text-2xl text-scanova-text-header">
													{service.title}
												</CardTitle>
												<p className="text-scanova-text-body mt-2">
													{service.description}
												</p>
											</div>
										</div>
									</CardHeader>

									<CardContent>
										<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
											<div>
												<h4 className="font-semibold text-scanova-text-header mb-3">
													Available Tests:
												</h4>
												<ul className="space-y-2">
													{service.tests.map((test, testIndex) => (
														<li
															key={testIndex}
															className="flex items-start gap-2 text-sm"
														>
															<div className="w-2 h-2 bg-scanova-teal rounded-full mt-2 flex-shrink-0"></div>
															<span className="text-scanova-text-body">
																{test}
															</span>
														</li>
													))}
												</ul>
											</div>

											<div>
												<h4 className="font-semibold text-scanova-text-header mb-3">
													Key Highlights:
												</h4>
												<ul className="space-y-2">
													{service.highlights.map(
														(highlight, highlightIndex) => (
															<li
																key={highlightIndex}
																className="flex items-start gap-2 text-sm"
															>
																<div className="w-2 h-2 bg-scanova-primary rounded-full mt-2 flex-shrink-0"></div>
																<span className="text-scanova-text-body">
																	{highlight}
																</span>
															</li>
														)
													)}
												</ul>
											</div>
										</div>

										<div className="mt-6 pt-6 border-t">
											<div className="flex flex-col sm:flex-row gap-3">
												<Button
													asChild
													className="bg-scanova-gradient hover:opacity-90 text-white"
												>
													<Link href="/packages">Book This Service</Link>
												</Button>
												{/* <Button
													variant="outline"
													className="border-scanova-primary text-scanova-primary hover:bg-scanova-primary hover:text-white"
												>
													Get Price Quote
												</Button> */}
											</div>
										</div>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</motion.div>
				</div>
			</section>

			{/* Special Features */}
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
							Why Choose Our Services?
						</h2>
						<p className="text-lg text-scanova-text-body max-w-2xl mx-auto">
							Advanced technology meets compassionate care for the most accurate
							diagnostics
						</p>
					</motion.div>

					<motion.div
						variants={staggerContainer}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
						className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
					>
						{specialFeatures.map((feature, index) => (
							<motion.div key={index} variants={fadeUpVariant}>
								<Card className="h-full text-center hover:shadow-lg transition-all duration-300">
									<CardHeader>
										<div className="mx-auto mb-4 p-3 bg-scanova-primary/10 rounded-full w-fit">
											{feature.icon}
										</div>
										<CardTitle className="text-lg text-scanova-text-header">
											{feature.title}
										</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-scanova-text-body text-sm">
											{feature.description}
										</p>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</motion.div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 bg-scanova-gradient text-white">
				<div className="max-w-4xl mx-auto px-4 text-center">
					<motion.div
						variants={fadeUpVariant}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
					>
						<h2 className="text-3xl md:text-4xl font-bold mb-6">
							Need a Comprehensive Health Check?
						</h2>
						<p className="text-xl text-white/90 mb-8">
							Combine multiple services with our health packages for better
							value and complete health assessment.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button
								asChild
								size="lg"
								className="bg-white text-scanova-primary hover:bg-gray-100 px-8 py-4"
							>
								<Link href="/packages">View Health Packages</Link>
							</Button>
							<Button
								asChild
								size="lg"
								variant="outline"
								className="bg-white text-scanova-primary hover:bg-gray-100 px-8 py-4"
							>
								<Link href="/home-collection">Schedule Consultation</Link>
							</Button>
						</div>
					</motion.div>
				</div>
			</section>
		</div>
	);
}

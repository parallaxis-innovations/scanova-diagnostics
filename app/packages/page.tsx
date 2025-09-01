"use client";

import { motion } from "framer-motion";
import { Check, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

export default function PackagesPage() {
	const fadeUpVariant = {
		hidden: { opacity: 0, y: 30 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
	};

	const packages = [
		{
			id: 1,
			title: "Heart & Diabetes Check Package",
			subtitle: "Complete cardiovascular and diabetes screening",
			price: 2499,
			originalPrice: 3500,
			discount: 29,
			testsCount: "25+ Tests",
			popular: true,
			rating: 4.9,
			reviews: 1250,
			features: [
				"Lipid Profile (Total Cholesterol, HDL, LDL, Triglycerides)",
				"Blood Sugar (Fasting & PP)",
				"HbA1c (Average Blood Sugar)",
				"Kidney Function (Urea, Creatinine, BUN)",
				"Liver Function (SGOT, SGPT, Bilirubin)",
				"Thyroid Profile (TSH, T3, T4)",
				"Complete Blood Count (CBC)",
				"ECG & Blood Pressure Check",
			],
			idealFor:
				"Adults 30+ years, those with family history of diabetes or heart disease",
			fastingRequired: true,
			reportTime: "Same day",
		},
		{
			id: 2,
			title: "Women's Wellness Package",
			subtitle: "Comprehensive health screening tailored for women",
			price: 3299,
			originalPrice: 4200,
			discount: 21,
			testsCount: "30+ Tests",
			popular: false,
			rating: 4.8,
			reviews: 890,
			features: [
				"Hormonal Profile (FSH, LH, Prolactin)",
				"Thyroid Complete (TSH, T3, T4, Anti-TPO)",
				"Vitamin D & B12",
				"Iron Profile (Iron, TIBC, Ferritin)",
				"Complete Blood Count (CBC)",
				"Liver & Kidney Function",
				"Pap Smear (if required)",
				"Bone Health Markers",
				"Cancer Markers (CA 125, CA 15-3)",
			],
			idealFor:
				"Women of all ages, especially those planning pregnancy or experiencing hormonal issues",
			fastingRequired: true,
			reportTime: "24-48 hours",
		},
		{
			id: 3,
			title: "Senior Health Package",
			subtitle: "Comprehensive wellness check for seniors",
			price: 4999,
			originalPrice: 6500,
			discount: 23,
			testsCount: "40+ Tests",
			popular: false,
			rating: 4.9,
			reviews: 670,
			features: [
				"Complete Blood Count (CBC) with ESR",
				"Comprehensive Metabolic Panel",
				"Lipid Profile Advanced",
				"Diabetes Panel (HbA1c, Fasting, PP)",
				"Kidney & Liver Function Complete",
				"Thyroid Profile Complete",
				"Vitamin D, B12 & Folate",
				"Bone Density (DEXA Scan)",
				"Cardiac Markers (Troponin, CK-MB)",
				"Prostate Specific Antigen (PSA) for men",
				"Chest X-Ray & ECG",
			],
			idealFor: "Adults 60+ years, comprehensive health assessment",
			fastingRequired: true,
			reportTime: "24-48 hours",
		},
		{
			id: 4,
			title: "Executive Health Checkup",
			subtitle: "Premium comprehensive health assessment",
			price: 7999,
			originalPrice: 10500,
			discount: 24,
			testsCount: "50+ Tests",
			popular: false,
			rating: 4.9,
			reviews: 445,
			features: [
				"All tests from Senior Health Package",
				"Advanced Cardiac Assessment (2D Echo, TMT)",
				"CT Chest (Low Dose)",
				"Upper Abdomen Ultrasound",
				"Advanced Cancer Screening Panel",
				"Stress Hormones (Cortisol)",
				"Complete Inflammatory Markers",
				"Pulmonary Function Test",
				"Eye Examination",
				"Consultation with Physician",
			],
			idealFor: "Working professionals, comprehensive executive screening",
			fastingRequired: true,
			reportTime: "48-72 hours",
		},
	];

	const benefits = [
		"Comprehensive test coverage designed by medical experts",
		"Transparent pricing with significant savings",
		"Free home sample collection (minimum order applies)",
		"Same-day to 48-hour report delivery",
		"NABL accredited laboratory testing",
		"Digital reports with lifetime access",
	];

	return (
		<div className="min-h-screen bg-gray-50 mt-12">
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
							Curated Health Packages for Peace of Mind
						</h1>
						<p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
							Our preventive health packages offer comprehensive panels designed
							by specialists at affordable rates—without compromising quality.
						</p>
						<div className="flex justify-center items-center gap-8 flex-wrap">
							<div className="flex items-center gap-2">
								<Check className="w-5 h-5" />
								<span>NABL Accredited</span>
							</div>
							<div className="flex items-center gap-2">
								<Check className="w-5 h-5" />
								<span>Free Home Collection</span>
							</div>
							<div className="flex items-center gap-2">
								<Check className="w-5 h-5" />
								<span>Same Day Reports</span>
							</div>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Why Choose Our Packages */}
			<section className="py-16 bg-white">
				<div className="max-w-7xl mx-auto px-4">
					<motion.div
						variants={fadeUpVariant}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
						className="text-center mb-12"
					>
						<h2 className="text-3xl font-bold text-scanova-text-header mb-4">
							Why Choose Our Health Packages?
						</h2>
					</motion.div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{benefits.map((benefit, index) => (
							<motion.div
								key={index}
								variants={fadeUpVariant}
								initial="hidden"
								whileInView="visible"
								viewport={{ once: true }}
								transition={{ delay: index * 0.1 }}
								className="flex items-start gap-3"
							>
								<Check className="w-5 h-5 text-scanova-teal mt-1 flex-shrink-0" />
								<p className="text-scanova-text-body">{benefit}</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Packages Grid */}
			<section className="py-16 bg-gray-50">
				<div className="max-w-7xl mx-auto px-4">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						{packages.map((pkg, index) => (
							<motion.div
								key={pkg.id}
								variants={fadeUpVariant}
								initial="hidden"
								whileInView="visible"
								viewport={{ once: true }}
								transition={{ delay: index * 0.1 }}
							>
								<Card
									className={`h-full hover:shadow-lg transition-all duration-300 ${
										pkg.popular ? "border-scanova-teal border-2 relative" : ""
									}`}
								>
									{pkg.popular && (
										<div className="absolute -top-3 left-6 bg-scanova-teal text-white px-4 py-1 rounded-full text-sm font-medium">
											Most Popular
										</div>
									)}

									<CardHeader className="pb-4">
										<div className="flex justify-between items-start mb-2">
											<div>
												<CardTitle className="text-xl text-scanova-text-header mb-1">
													{pkg.title}
												</CardTitle>
												<p className="text-scanova-text-body text-sm">
													{pkg.subtitle}
												</p>
											</div>
											<Badge variant="secondary" className="text-xs">
												{pkg.testsCount}
											</Badge>
										</div>

										<div className="flex items-center gap-2 mb-3">
											<div className="flex items-center gap-1">
												<Star className="w-4 h-4 text-yellow-400 fill-current" />
												<span className="text-sm font-medium">
													{pkg.rating}
												</span>
											</div>
											<span className="text-sm text-gray-500">
												({pkg.reviews} reviews)
											</span>
										</div>

										<div className="flex items-end gap-2 mb-4">
											<span className="text-3xl font-bold text-scanova-primary">
												₹{pkg.price.toLocaleString()}
											</span>
											<span className="text-lg text-gray-500 line-through">
												₹{pkg.originalPrice.toLocaleString()}
											</span>
											<Badge className="bg-green-100 text-green-800 text-xs">
												{pkg.discount}% OFF
											</Badge>
										</div>

										<div className="flex gap-4 text-sm text-scanova-text-body mb-4">
											<div>
												<span className="font-medium">Fasting:</span>{" "}
												{pkg.fastingRequired ? "Required" : "Not Required"}
											</div>
											<div>
												<span className="font-medium">Reports:</span>{" "}
												{pkg.reportTime}
											</div>
										</div>
									</CardHeader>

									<CardContent>
										<div className="mb-6">
											<h4 className="font-semibold text-scanova-text-header mb-2">
												Ideal For:
											</h4>
											<p className="text-sm text-scanova-text-body">
												{pkg.idealFor}
											</p>
										</div>

										<Accordion type="single" collapsible className="mb-6">
											<AccordionItem value="tests" className="border-none">
												<AccordionTrigger className="text-left hover:no-underline">
													<span className="font-semibold text-scanova-text-header">
														View All Tests Included ({pkg.testsCount})
													</span>
												</AccordionTrigger>
												<AccordionContent>
													<ul className="space-y-2 mt-3">
														{pkg.features.map((feature, featureIndex) => (
															<li
																key={featureIndex}
																className="flex items-start gap-2 text-sm"
															>
																<Check className="w-4 h-4 text-scanova-teal mt-0.5 flex-shrink-0" />
																<span className="text-scanova-text-body">
																	{feature}
																</span>
															</li>
														))}
													</ul>
												</AccordionContent>
											</AccordionItem>
										</Accordion>

										<div className="space-y-3">
											<Link href="/home-collection">
												<Button className="w-full bg-scanova-gradient hover:opacity-90 text-white">
													Book Package Now
												</Button>
											</Link>
											{/* <Button variant="outline" className="w-full border-scanova-primary text-scanova-primary hover:bg-scanova-primary hover:text-white">
                        Download Sample Report
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button> */}
										</div>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</div>
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
							Need Help Choosing the Right Package?
						</h2>
						<p className="text-xl text-white/90 mb-8">
							Our healthcare experts can guide you in selecting the most
							suitable health package based on your age, lifestyle, and health
							concerns.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Link href="/home-collection">
								<Button
									size="lg"
									className="bg-white text-scanova-primary hover:bg-gray-100 px-8 py-4"
								>
									Consult Our Expert
								</Button>
							</Link>

							<Link href="/packages">
								<Button
									size="lg"
									variant="outline"
									className="border-white bg-white text-scanova-primary px-8 py-4"
								>
									Compare All Packages
								</Button>
							</Link>
						</div>
					</motion.div>
				</div>
			</section>
		</div>
	);
}

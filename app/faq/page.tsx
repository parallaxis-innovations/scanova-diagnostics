"use client";

import { motion } from "framer-motion";
import { Phone, Mail, Clock, Shield, FileText, Home } from "lucide-react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scan } from "lucide-react";

export default function FAQPage() {
	const fadeUpVariant = {
		hidden: { opacity: 0, y: 30 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
	};

	const categories = [
		{
			icon: <Shield className="w-6 h-6 text-scanova-teal" />,
			title: "General",
			faqs: [
				{
					question: "Are your labs accredited?",
					answer:
						"Yes—our labs are NABL-accredited, ensuring adherence to the strictest quality standards. This accreditation guarantees that our testing procedures, equipment, and staff meet international standards for accurate and reliable results.",
				},
				{
					question: "What are your operating hours?",
					answer:
						"Our diagnostic center is open Monday to Saturday from 7:00 AM to 9:00 PM, and Sunday from 8:00 AM to 6:00 PM. However, our home collection service is available 24/7 for your convenience.",
				},
				{
					question: "Do you accept insurance?",
					answer:
						"Yes, we accept most major health insurance plans. Please bring your insurance card and policy details when visiting our center. For home collection, please inform us about your insurance coverage when booking.",
				},
			],
		},
		{
			icon: <Home className="w-6 h-6 text-scanova-teal" />,
			title: "Home Collection",
			faqs: [
				{
					question: "How do I book a home test?",
					answer:
						"Visit the Home Collection page on our website, fill out your details including name, contact information, address, preferred date/time, and required tests. Our team will contact you within 15 minutes to confirm your appointment and provide any special instructions.",
				},
				{
					question: "Is there a minimum bill requirement for free collection?",
					answer:
						"Yes, home sample collection is free for orders above ₹500. For orders below this amount, a nominal collection charge of ₹150 applies. This helps us maintain the quality and reliability of our home service.",
				},
				{
					question: "Do you offer imaging tests at home?",
					answer:
						"Yes—select categories like portable ECG, X-Ray, and Holter monitoring are available at home. Our mobile units are equipped with advanced portable equipment to provide accurate results at your convenience.",
				},
				{
					question: "What safety protocols do you follow for home collection?",
					answer:
						"All our sample collectors use complete PPE including masks, gloves, face shields, and carry sanitizers. They follow strict hygiene protocols, maintain social distancing, and sanitize all equipment before and after each collection.",
				},
			],
		},
		{
			icon: <FileText className="w-6 h-6 text-scanova-teal" />,
			title: "Reports & Results",
			faqs: [
				{
					question: "When will I get my report?",
					answer:
						"Most pathology reports are delivered the same day by evening. Imaging studies may take up to 48 hours depending on complexity. Specialized tests like cultures or histopathology may take 3-5 days. You'll receive updates via SMS and email.",
				},
				{
					question: "How can I access my reports?",
					answer:
						"Reports are available through multiple channels: digital copies via email and SMS, physical copies can be collected from our center, and you can access all your reports through our patient portal on the website or mobile app.",
				},
				{
					question: "Do you retain medical history?",
					answer:
						"Yes—we maintain your complete medical history for up to 5 years, including all diagnostic reports, imaging studies, and trend analysis. This helps in monitoring your health progress and is valuable for future medical consultations.",
				},
				{
					question: "Can I get my reports explained?",
					answer:
						"Absolutely! We offer free report consultation where our qualified medical professionals explain your results, highlight any abnormalities, and provide guidance on next steps. This service is available both in-person and over phone.",
				},
			],
		},
		{
			icon: <Scan className="w-6 h-6 text-scanova-teal" />,
			title: "Imaging & Tests",
			faqs: [
				{
					question: "Do I need to fast for my blood test?",
					answer:
						"Fasting requirements vary by test. Generally, tests like lipid profile, blood sugar, and liver function require 10-12 hours of fasting. We'll inform you about specific fasting requirements when you book your test or through SMS/call before your appointment.",
				},
				{
					question: "How accurate are your test results?",
					answer:
						"Our NABL accreditation ensures 99.9% accuracy in test results. We use advanced automated analyzers, maintain strict quality control, participate in external quality assurance programs, and all reports are reviewed by qualified pathologists.",
				},
				{
					question: "Can I book tests online?",
					answer:
						"Yes, you can book all types of tests online through our website. Simply select the tests you need, choose your preferred time slot, make payment online, and our team will contact you to confirm the appointment.",
				},
				{
					question: "What if I need to cancel or reschedule my appointment?",
					answer:
						"You can cancel or reschedule your appointment up to 2 hours before the scheduled time by calling our helpline. For home collections, we recommend giving at least 4 hours notice to avoid any cancellation charges.",
				},
			],
		},
	];

	const quickContacts = [
		{
			icon: <Phone className="w-5 h-5 text-scanova-teal" />,
			title: "Call Us",
			info: "+91 90072 04996",
			description: "24/7 helpline for queries & bookings",
		},
		{
			icon: <Mail className="w-5 h-5 text-scanova-teal" />,
			title: "Email Us",
			info: "info@scanovadiagnostics.com",
			description: "Get response within 2 hours",
		},
		{
			icon: <Clock className="w-5 h-5 text-scanova-teal" />,
			title: "WhatsApp",
			info: "+91 90072 04996",
			description: "Quick support & report sharing",
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
							Frequently Asked Questions
						</h1>
						<p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
							Find answers to common questions about our services, procedures,
							and policies. Can&apos;t find what you&apos;re looking for?
							Contact us directly.
						</p>
					</motion.div>
				</div>
			</section>

			{/* Quick Contact Cards */}
			<section className="py-12 bg-white">
				<div className="max-w-7xl mx-auto px-4">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{quickContacts.map((contact, index) => (
							<motion.div
								key={index}
								variants={fadeUpVariant}
								initial="hidden"
								whileInView="visible"
								viewport={{ once: true }}
								transition={{ delay: index * 0.1 }}
							>
								<Card className="text-center hover:shadow-lg transition-all duration-300">
									<CardHeader className="pb-2">
										<div className="mx-auto mb-3 p-3 bg-scanova-teal/10 rounded-full w-fit">
											{contact.icon}
										</div>
										<CardTitle className="text-lg text-scanova-text-header">
											{contact.title}
										</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="font-semibold text-scanova-primary mb-1">
											{contact.info}
										</p>
										<p className="text-sm text-scanova-text-body">
											{contact.description}
										</p>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* FAQ Categories */}
			<section className="py-16 bg-gray-50">
				<div className="max-w-4xl mx-auto px-4">
					<motion.div
						variants={fadeUpVariant}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
						className="text-center mb-12"
					>
						<h2 className="text-3xl font-bold text-scanova-text-header mb-4">
							Browse Questions by Category
						</h2>
						<p className="text-lg text-scanova-text-body">
							Choose a category below to find specific answers
						</p>
					</motion.div>

					<div className="space-y-8">
						{categories.map((category, categoryIndex) => (
							<motion.div
								key={categoryIndex}
								variants={fadeUpVariant}
								initial="hidden"
								whileInView="visible"
								viewport={{ once: true }}
								transition={{ delay: categoryIndex * 0.1 }}
							>
								<Card className="overflow-hidden">
									<CardHeader className="bg-scanova-primary/5">
										<div className="flex items-center gap-3">
											{category.icon}
											<CardTitle className="text-xl text-scanova-text-header">
												{category.title}
											</CardTitle>
										</div>
									</CardHeader>
									<CardContent className="p-0">
										<Accordion type="single" collapsible className="w-full">
											{category.faqs.map((faq, faqIndex) => (
												<AccordionItem
													key={faqIndex}
													value={`${categoryIndex}-${faqIndex}`}
													className="border-b last:border-b-0"
												>
													<AccordionTrigger className="px-6 py-4 text-left hover:no-underline hover:bg-gray-50">
														<span className="font-semibold text-scanova-text-header">
															{faq.question}
														</span>
													</AccordionTrigger>
													<AccordionContent className="px-6 pb-4 text-scanova-text-body">
														{faq.answer}
													</AccordionContent>
												</AccordionItem>
											))}
										</Accordion>
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
							Still Have Questions?
						</h2>
						<p className="text-xl text-white/90 mb-8">
							Our customer support team is available 24/7 to help you with any
							queries about our services, booking process, or test results.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button
								asChild
								size="lg"
								className="bg-white text-scanova-primary hover:bg-gray-100 px-8 py-4"
							>
								<a href="tel:+919876543210">Call +91 98765 43210</a>
							</Button>
							<Button
								asChild
								size="lg"
								variant="outline"
								className="border-white bg-white text-scanova-primary px-8 py-4"
							>
								<a
									href="https://wa.me/919876543210"
									target="_blank"
									rel="noopener noreferrer"
								>
									Chat with Us
								</a>
							</Button>
						</div>
					</motion.div>
				</div>
			</section>
		</div>
	);
}

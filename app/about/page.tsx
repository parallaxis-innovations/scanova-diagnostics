// app/about/page.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  const fadeIn = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

  return (
    <div className="min-h-screen bg-gray-50 mt-12">
      {/* Hero Section */}
      <section className="bg-scanova-gradient text-white py-20">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Scanova Diagnostics</h1>
          <p className="text-lg md:text-xl opacity-90">
            Delivering accurate diagnostics with care, precision, and convenience—right when you need it.
          </p>
        </motion.div>
      </section>

      {/* About Content */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6 space-y-12">
          
          {/* Who We Are */}
          <motion.div initial="hidden" whileInView="visible" variants={fadeIn}>
            <h2 className="text-3xl font-semibold text-scanova-text-header mb-4">Who We Are</h2>
            <p className="text-scanova-text-body leading-relaxed">
              At Scanova Diagnostics, we’re a group of dedicated healthcare professionals with a vision to bring accurate, reliable, and timely diagnostics into the comfort of your home. Our NABL-accredited labs, advanced imaging systems, and skilled team ensure you get clarity when it matters most.
            </p>
          </motion.div>

          {/* Our Mission */}
          <motion.div initial="hidden" whileInView="visible" variants={fadeIn}>
            <h2 className="text-3xl font-semibold text-scanova-text-header mb-4">Our Mission</h2>
            <p className="text-scanova-text-body leading-relaxed">
              We strive to empower patients and doctors alike with swift and trustworthy test results. From online bookings to home sample collection—helping you make informed health decisions with ease and confidence.
            </p>
          </motion.div>

          {/* Core Values */}
          <motion.div initial="hidden" whileInView="visible" variants={fadeIn}>
            <h2 className="text-3xl font-semibold text-scanova-text-header mb-6">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Accuracy & Quality", desc: "State-of-the-art equipment and stringent quality control ensure precise diagnostics." },
                { title: "Speed & Convenience", desc: "Home collection & same-day reporting to fit your busy life." },
                { title: "Trust & Care", desc: "A compassionate team you can trust with your health." },
              ].map((val, idx) => (
                <div key={idx} className="bg-gray-100 rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-medium text-scanova-primary mb-2">{val.title}</h3>
                  <p className="text-scanova-text-body">{val.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Why Choose Us */}
          <motion.div initial="hidden" whileInView="visible" variants={fadeIn}>
            <h2 className="text-3xl font-semibold text-scanova-text-header mb-4">Why Choose Scanova?</h2>
            <ul className="list-disc list-inside text-scanova-text-body space-y-2 leading-relaxed">
              <li>24/7 home collection availability with qualified phlebotomists.</li>
              <li>Fast digital reports—delivered securely to your email or portal.</li>
              <li>Fully accredited labs, ensuring consistent and accurate results.</li>
              <li>Seamless online appointment booking for convenience.</li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-scanova-gradient text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" variants={fadeIn}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Experience Diagnostics with Care</h2>
            <p className="text-xl opacity-90 mb-8">
              Trust Scanova Diagnostics for a seamless, accurate healthcare experience that cares for you every step of the way.
            </p>
            <Button asChild className="bg-white text-scanova-primary hover:bg-gray-100">
              <Link href="/services">Explore Our Services</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

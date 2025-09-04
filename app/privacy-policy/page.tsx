"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicyPage() {
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

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
              Privacy Policy
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Your privacy is important to us at Scanova Diagnostics. This
              Privacy Policy explains how we collect, use, and protect your
              information when you use our hospital services, online appointment
              booking, and home collection facilities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 space-y-12">
          <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-2xl font-bold text-scanova-text-header mb-4">
              1. Information We Collect
            </h2>
            <p className="text-scanova-text-body leading-relaxed">
              We collect personal details such as name, age, gender, contact
              information, medical history, and test requirements when you
              register, book an appointment, or request home collection. We may
              also collect technical data like IP address and browser details
              for security and analytics.
            </p>
          </motion.div>

          <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-2xl font-bold text-scanova-text-header mb-4">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc list-inside text-scanova-text-body space-y-2">
              <li>To confirm and manage your appointments or test bookings</li>
              <li>To provide home collection and diagnostic services</li>
              <li>To generate accurate reports and deliver results securely</li>
              <li>
                To improve our website, services, and patient experience
              </li>
              <li>To comply with medical, legal, and regulatory requirements</li>
            </ul>
          </motion.div>

          <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-2xl font-bold text-scanova-text-header mb-4">
              3. Data Security
            </h2>
            <p className="text-scanova-text-body leading-relaxed">
              We implement strict security protocols to protect your personal
              and medical data. Access is limited to authorized healthcare
              professionals, and all data is stored securely with encryption and
              regular audits.
            </p>
          </motion.div>

          <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-2xl font-bold text-scanova-text-header mb-4">
              4. Sharing of Information
            </h2>
            <p className="text-scanova-text-body leading-relaxed">
              We do not sell or rent your personal data. Information may be
              shared only with:
            </p>
            <ul className="list-disc list-inside text-scanova-text-body space-y-2 mt-2">
              <li>Doctors, pathologists, or radiologists for accurate reporting</li>
              <li>
                Authorized diagnostic staff for fulfilling your service requests
              </li>
              <li>Regulatory bodies, if legally required</li>
            </ul>
          </motion.div>

          <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-2xl font-bold text-scanova-text-header mb-4">
              5. Patient Rights
            </h2>
            <p className="text-scanova-text-body leading-relaxed">
              You have the right to access, update, or request deletion of your
              personal data. You may also withdraw consent for data usage,
              subject to applicable medical and legal obligations.
            </p>
          </motion.div>

          <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-2xl font-bold text-scanova-text-header mb-4">
              6. Cookies and Tracking
            </h2>
            <p className="text-scanova-text-body leading-relaxed">
              Our website may use cookies and similar technologies to enhance
              your browsing experience, analyze traffic, and remember your
              preferences. You can manage cookie settings through your browser.
            </p>
          </motion.div>

          <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-2xl font-bold text-scanova-text-header mb-4">
              7. Updates to This Policy
            </h2>
            <p className="text-scanova-text-body leading-relaxed">
              Scanova Diagnostics may update this Privacy Policy periodically.
              Any changes will be posted on this page with an updated effective
              date.
            </p>
          </motion.div>

          <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-2xl font-bold text-scanova-text-header mb-4">
              8. Contact Us
            </h2>
            <p className="text-scanova-text-body leading-relaxed">
              For questions about this Privacy Policy or your data rights,
              please contact us at:{" "}
              <span className="font-semibold text-scanova-primary">
                info@scanovadiagnostics.com
              </span>
            </p>
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
              Your Health, Your Privacy
            </h2>
            <p className="text-xl text-white/90 mb-8">
              At Scanova Diagnostics, we ensure that your medical data remains
              safe, confidential, and accessible only to you and your doctors.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white text-scanova-primary hover:bg-gray-100 px-8 py-4"
            >
              <Link href="/services">Explore Our Services</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

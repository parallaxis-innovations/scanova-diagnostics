"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TermsConditionsPage() {
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
              Terms & Conditions
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Please read these Terms & Conditions carefully before using the
              services provided by Scanova Diagnostics, including online
              appointment booking, diagnostic tests, and home collection
              facilities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 space-y-12">
          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-scanova-text-header mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-scanova-text-body leading-relaxed">
              By accessing or using Scanova Diagnostics’ website or services,
              you agree to comply with these Terms & Conditions. If you do not
              agree, please discontinue use immediately.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-scanova-text-header mb-4">
              2. Services Provided
            </h2>
            <p className="text-scanova-text-body leading-relaxed">
              Scanova Diagnostics offers diagnostic tests, medical imaging,
              health check-ups, and home collection services. All services are
              provided by trained professionals and subject to availability.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-scanova-text-header mb-4">
              3. Booking & Payment
            </h2>
            <ul className="list-disc list-inside text-scanova-text-body space-y-2">
              <li>
                Appointments must be booked online or via our helpline before
                visiting or requesting home collection.
              </li>
              <li>
                Payments are required before or at the time of availing services
                unless otherwise specified.
              </li>
              <li>
                Prices may vary depending on the test, package, or location of
                service.
              </li>
            </ul>
          </motion.div>

          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-scanova-text-header mb-4">
              4. Cancellation & Refund Policy
            </h2>
            <p className="text-scanova-text-body leading-relaxed">
              Cancellations should be requested at least 24 hours before the
              scheduled appointment. Refunds (if applicable) will be processed
              as per company policy. No refunds are provided for completed
              tests.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-scanova-text-header mb-4">
              5. Test Reports & Confidentiality
            </h2>
            <p className="text-scanova-text-body leading-relaxed">
              Test reports are released only to the patient or authorized
              representative. All medical information is treated as strictly
              confidential in accordance with our{" "}
              <Link href="/privacy-policy" className="text-scanova-primary underline">
                Privacy Policy
              </Link>
              .
            </p>
          </motion.div>

          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-scanova-text-header mb-4">
              6. Responsibilities of Users
            </h2>
            <ul className="list-disc list-inside text-scanova-text-body space-y-2">
              <li>
                Provide accurate personal and medical information during
                registration and booking.
              </li>
              <li>
                Follow all pre-test instructions provided for accurate results.
              </li>
              <li>
                Ensure safe access to your location if availing home collection.
              </li>
            </ul>
          </motion.div>

          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-scanova-text-header mb-4">
              7. Limitation of Liability
            </h2>
            <p className="text-scanova-text-body leading-relaxed">
              While we strive for accuracy and reliability, Scanova Diagnostics
              shall not be liable for indirect, incidental, or consequential
              damages arising from the use of our services or reliance on test
              reports.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-scanova-text-header mb-4">
              8. Amendments
            </h2>
            <p className="text-scanova-text-body leading-relaxed">
              Scanova Diagnostics reserves the right to update or modify these
              Terms & Conditions at any time. The revised terms will be posted
              on this page with an updated effective date.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-scanova-text-header mb-4">
              9. Contact Us
            </h2>
            <p className="text-scanova-text-body leading-relaxed">
              For any questions regarding these Terms & Conditions, please
              contact us at:{" "}
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
              Trusted Healthcare, Transparent Terms
            </h2>
            <p className="text-xl text-white/90 mb-8">
              By choosing Scanova Diagnostics, you agree to our commitment of
              providing reliable services while safeguarding your rights as a
              patient.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white text-scanova-primary hover:bg-gray-100 px-8 py-4"
            >
              <Link href="/services">Book a Service</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RefundPolicyPage() {
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
              Refund Policy
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              At Scanova Diagnostics, we value your trust and are committed to
              ensuring transparency in our services. This Refund Policy explains
              when and how refunds are applicable for diagnostic tests and
              services booked with us.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 space-y-12">
          {/* Eligibility for Refund */}
          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-scanova-text-header mb-4">
              1. Eligibility for Refund
            </h2>
            <p className="text-scanova-text-body leading-relaxed">
              Refunds are applicable only in specific cases where services could
              not be delivered as committed. Examples include cancellation of a
              booked test before sample collection or if Scanova Diagnostics is
              unable to process the test due to technical or operational
              reasons.
            </p>
          </motion.div>

          {/* Non-Refundable Cases */}
          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-scanova-text-header mb-4">
              2. Non-Refundable Cases
            </h2>
            <ul className="list-disc list-inside text-scanova-text-body space-y-2">
              <li>
                If the sample has already been collected and processed by our
                laboratory.
              </li>
              <li>
                If the patient provides incomplete or incorrect information
                affecting the validity of the test.
              </li>
              <li>
                No-shows or last-minute cancellations made after the technician
                has been dispatched.
              </li>
            </ul>
          </motion.div>

          {/* Refund Process */}
          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-scanova-text-header mb-4">
              3. Refund Process
            </h2>
            <p className="text-scanova-text-body leading-relaxed">
              All eligible refunds will be processed through the original mode
              of payment used at the time of booking. The timeline for receiving
              the refund may vary depending on the bank or payment service
              provider but generally takes 7–10 business days.
            </p>
          </motion.div>

          {/* Cancellation by Scanova */}
          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-scanova-text-header mb-4">
              4. Cancellation by Scanova Diagnostics
            </h2>
            <p className="text-scanova-text-body leading-relaxed">
              In rare situations where Scanova Diagnostics must cancel a booking
              due to unforeseen circumstances (such as equipment breakdown or
              logistic issues), a full refund will be initiated to the customer.
            </p>
          </motion.div>

          {/* Contact Us */}
          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-scanova-text-header mb-4">
              5. Contact Us
            </h2>
            <p className="text-scanova-text-body leading-relaxed">
              For refund-related queries, please write to us at:{" "}
              <span className="font-semibold text-scanova-primary">
                info@scanovadiagnostics.com
              </span>{" "}
              with your booking ID and transaction details. Our support team
              will assist you promptly.
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
              Hassle-Free Refunds
            </h2>
            <p className="text-xl text-white/90 mb-8">
              We strive to maintain trust by ensuring a clear and fair refund
              process. Your satisfaction and confidence in our services are our
              top priority.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white text-scanova-primary hover:bg-gray-100 px-8 py-4"
            >
              <Link href="/contact">Contact Support</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

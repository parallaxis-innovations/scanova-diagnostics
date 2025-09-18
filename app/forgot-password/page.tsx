"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Mail, Loader2, Download, Calendar, FileText, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { directusApi } from "@/lib/directus";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// ✅ fetch call goes inside handleSubmit
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setSuccess("");
  setIsLoading(true);

  try {
    const res = await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    setSuccess("Password reset email sent. Please check your inbox.");
  } catch (err: any) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
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
          <Image src="/login-2.png" alt="Doctor" fill className="object-cover opacity-90" />
          <div className="absolute inset-0 bottom-0 bg-gradient-to-t from-[#0E7AA4] via-[#1E517C]/30 to-transparent z-10 pointer-events-none"></div>
          <div className="relative z-20">
            <h1 className="text-3xl font-bold mb-2">Reset your password</h1>
            <p className="text-sm leading-relaxed text-gray-200">Enter your email and we will send you a password reset link.</p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <Card className="border-0 shadow-none">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-3xl font-semibold text-gray-800">Forgot Password</CardTitle>
              <p className="text-gray-500 text-sm">We&apos;ll email you a secure link</p>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-6 border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative mt-1">
                    <Input
                      id="email"
                      type="email"
                      required
                      disabled={isLoading}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12"
                      placeholder="you@example.com"
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-scanova-dark-blue to-scanova-primary hover:opacity-90 text-white h-12 text-lg font-medium rounded-lg disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Sending...</span>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>

              <p className="mt-6 text-sm text-center text-gray-600">
                Remembered your password?{" "}
                <Link href="/login" className="text-scanova-primary font-medium hover:underline">Back to Login</Link>
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { icon: Download, text: "Download Reports" },
                  { icon: Calendar, text: "Track Appointments" },
                  { icon: FileText, text: "Health History" },
                  { icon: Settings, text: "Manage Profile" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition">
                    <Icon className="w-5 h-5 text-scanova-primary" />
                    <span className="text-gray-700 text-sm">{text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
} 
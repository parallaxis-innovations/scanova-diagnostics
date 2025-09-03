"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, User, Mail, Calendar, FileText, Settings, LogOut } from "lucide-react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-scanova-primary" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <motion.div
        variants={fadeUpVariant}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          My Profile
        </h1>

        {/* User Info */}
        <Card className="mb-10">
          <CardHeader className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-scanova-primary">
              <Image
                src={session?.user?.image || "/default-avatar.png"}
                alt="Profile Picture"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <CardTitle className="text-2xl text-gray-800">
                {session?.user?.name || "Patient"}
              </CardTitle>
              <p className="text-gray-500 flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                {session?.user?.email}
              </p>
            </div>
          </CardHeader>
        </Card>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { icon: Calendar, label: "My Appointments", href: "/appointments" },
            { icon: FileText, label: "My Reports", href: "/reports" },
            { icon: Settings, label: "Account Settings", href: "/settings" },
          ].map(({ icon: Icon, label, href }) => (
            <Card
              key={label}
              className="p-6 hover:shadow-lg transition cursor-pointer"
              onClick={() => router.push(href)}
            >
              <CardContent className="flex items-center gap-4">
                <Icon className="w-8 h-8 text-scanova-primary" />
                <span className="text-lg font-medium text-gray-700">
                  {label}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sign Out */}
        <div className="mt-10 text-center">
          <Button
            variant="outline"
            className="border-red-500 text-red-600 hover:bg-red-50"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

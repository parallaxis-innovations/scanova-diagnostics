"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Mail, LogOut } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type PersonalForm = {
  full_name: string;
  phone_number: string;
  email_id: string;
  address: string;
  age: string;
  gender: string;
  blood_group: string;
};

type MedicalForm = {
  pre_existing_conditions: string;
  chronic_illnesses: string;
  allergies: string;
  medical_information: string;
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [savingMedical, setSavingMedical] = useState(false);
  const [personal, setPersonal] = useState<PersonalForm>({
    full_name: "",
    phone_number: "",
    email_id: "",
    address: "",
    age: "",
    gender: "",
    blood_group: "",
  });
  const [medical, setMedical] = useState<MedicalForm>({
    pre_existing_conditions: "",
    chronic_illnesses: "",
    allergies: "",
    medical_information: "",
  });

  const headers = useMemo(() => ({
    "Content-Type": "application/json",
  }), []);

  useEffect(() => {
    async function load() {
      if (!session?.user) return;
      try {
        const [pRes, mRes] = await Promise.all([
          fetch("/api/profile/personal", { headers }),
          fetch("/api/profile/medical", { headers }),
        ]);
        const pJson = await pRes.json();
        const mJson = await mRes.json();
        if (pJson?.data) {
          setPersonal((prev) => ({
            ...prev,
            full_name: pJson.data.full_name ?? prev.full_name,
            phone_number: pJson.data.phone_number ?? prev.phone_number,
            email_id: pJson.data.email_id ?? (session.user?.email as string) ?? prev.email_id,
            address: pJson.data.address ?? prev.address,
            age: String(pJson.data.age ?? prev.age),
            gender: pJson.data.gender ?? prev.gender,
            blood_group: pJson.data.blood_group ?? prev.blood_group,
          }));
        } else if (session.user) {
          setPersonal((prev) => ({
            ...prev,
            email_id: (session.user?.email as string) || "",
            full_name: (session.user?.name as string) || prev.full_name,
          }));
        }
        if (mJson?.data) {
          setMedical({
            pre_existing_conditions: mJson.data.pre_existing_conditions ?? "",
            chronic_illnesses: mJson.data.chronic_illnesses ?? "",
            allergies: mJson.data.allergies ?? "",
            medical_information: mJson.data.medical_information ?? "",
          });
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [session, headers]);

  if (status === "loading" || loading) {
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

  async function savePersonal() {
    setSavingPersonal(true);
    try {
      const res = await fetch("/api/profile/personal", {
        method: "POST",
        headers,
        body: JSON.stringify({
          ...personal,
          age: personal.age ? Number(personal.age) : undefined,
        }),
      });
      await res.json();
    } finally {
      setSavingPersonal(false);
    }
  }

  async function saveMedical() {
    setSavingMedical(true);
    console.log("medical",medical);
    try {
      const res = await fetch("/api/profile/medical", {
        method: "POST",
        headers,
        body: JSON.stringify(medical),
      });
      await res.json();
    } finally {
      setSavingMedical(false);
    }
  }

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <CardTitle className="mb-4">Personal Information</CardTitle>
            <div className="space-y-3">
              <Input placeholder="Full name" value={personal.full_name} onChange={(e) => setPersonal({ ...personal, full_name: e.target.value })} />
              <Input placeholder="Phone number" value={personal.phone_number} onChange={(e) => setPersonal({ ...personal, phone_number: e.target.value })} />
              <Input placeholder="Email" value={personal.email_id} onChange={(e) => setPersonal({ ...personal, email_id: e.target.value })} />
              <Textarea placeholder="Address" value={personal.address} onChange={(e) => setPersonal({ ...personal, address: e.target.value })} />
              <Input placeholder="Age" value={personal.age} onChange={(e) => setPersonal({ ...personal, age: e.target.value })} />
              <Input placeholder="Gender" value={personal.gender} onChange={(e) => setPersonal({ ...personal, gender: e.target.value })} />
              <Input placeholder="Blood group" value={personal.blood_group} onChange={(e) => setPersonal({ ...personal, blood_group: e.target.value })} />
              <Button onClick={savePersonal} disabled={savingPersonal}>
                {savingPersonal ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Save Personal
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <CardTitle className="mb-4">Medical Information</CardTitle>
            <div className="space-y-3">
              <Textarea placeholder="Pre-existing conditions" value={medical.pre_existing_conditions} onChange={(e) => setMedical({ ...medical, pre_existing_conditions: e.target.value })} />
              <Textarea placeholder="Chronic illnesses" value={medical.chronic_illnesses} onChange={(e) => setMedical({ ...medical, chronic_illnesses: e.target.value })} />
              <Textarea placeholder="Allergies" value={medical.allergies} onChange={(e) => setMedical({ ...medical, allergies: e.target.value })} />
              <Textarea placeholder="Medical information" value={medical.medical_information} onChange={(e) => setMedical({ ...medical, medical_information: e.target.value })} />
              <Button onClick={saveMedical} disabled={savingMedical}>
                {savingMedical ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Save Medical
              </Button>
            </div>
          </Card>
        </div>

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

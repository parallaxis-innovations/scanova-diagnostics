"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Loader2, 
  Mail, 
  LogOut, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  Heart, 
  Users, 
  Edit3, 
  Save, 
  Plus, 
  Trash2,
  Shield,
  Activity,
  AlertCircle
} from "lucide-react";
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
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [savingMedical, setSavingMedical] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

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
  });

  const [family, setFamily] = useState<any[]>([]);

  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
    }),
    []
  );

  useEffect(() => {
    async function load() {
      if (!session?.user) return;
      
      setLoading(true);
      
      try {
        console.log("Loading profile data for user:", session.user);
        
        // Load personal information
        const pRes = await fetch("/api/profile/personal", { headers });
        const pJson = await pRes.json();
        console.log("Personal data response:", pJson);

        if (pJson?.data) {
          console.log("Setting personal data:", pJson.data);
          setPersonal({
            full_name: pJson.data.full_name || "",
            phone_number: pJson.data.phone_number || "",
            email_id: pJson.data.email_id || (session.user?.email as string) || "",
            address: pJson.data.address || "",
            age: pJson.data.age ? String(pJson.data.age) : "",
            gender: pJson.data.gender || "",
            blood_group: pJson.data.blood_group || "",
          });
        } else {
          // Set default values from session
          console.log("No personal data found, using session defaults");
          setPersonal((prev) => ({
            ...prev,
            email_id: (session.user?.email as string) || "",
            full_name: (session.user?.name as string) || "",
          }));
        }

        // Load medical information
        const mRes = await fetch("/api/profile/medical", { headers });
        const mJson = await mRes.json();
        console.log("Medical data response:", mJson);

        if (mJson?.data) {
          console.log("Setting medical data:", mJson.data);
          setMedical({
            pre_existing_conditions: mJson.data.pre_existing_conditions || "",
            chronic_illnesses: mJson.data.chronic_illnesses || "",
            allergies: mJson.data.allergies || "",
          });
        } else {
          console.log("No medical data found, keeping empty defaults");
        }

        // Load family information
        const fRes = await fetch("/api/profile/family", { headers });
        const fJson = await fRes.json();
        console.log("Family data response:", fJson);
        
        if (fJson?.data) {
          setFamily(fJson.data);
        }
        
      } catch (error) {
        console.error("Error loading profile data:", error);
      } finally {
        setLoading(false);
      }
    }
    
    if (session?.user && status === "authenticated") {
      load();
    }
  }, [session, status, headers]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-scanova/primary to-scanova/primary-light flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 animate-spin text-scanova/primary mx-auto mb-4" />
          <p className="text-scanova/text-body font-medium">Loading your profile...</p>
        </motion.div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0
    }
  };

  async function savePersonal() {
    setSavingPersonal(true);
    try {
      console.log("Saving personal data:", personal);
      const res = await fetch("/api/profile/personal", {
        method: "POST",
        headers,
        body: JSON.stringify({
          ...personal,
          age: personal.age ? Number(personal.age) : undefined,
        }),
      });
      const result = await res.json();
      console.log("Save personal response:", result);
      
      if (!res.ok) {
        console.error("Failed to save personal data:", result);
      } else {
        console.log("Personal data saved successfully");
      }
    } catch (error) {
      console.error("Error saving personal data:", error);
    } finally {
      setSavingPersonal(false);
    }
  }

  async function saveMedical() {
    setSavingMedical(true);
    try {
      console.log("Saving medical data:", medical);
      const res = await fetch("/api/profile/medical", {
        method: "POST",
        headers,
        body: JSON.stringify(medical),
      });
      const result = await res.json();
      console.log("Save medical response:", result);
      
      if (!res.ok) {
        console.error("Failed to save medical data:", result);
      } else {
        console.log("Medical data saved successfully");
      }
    } catch (error) {
      console.error("Error saving medical data:", error);
    } finally {
      setSavingMedical(false);
    }
  }

  function addFamily() {
    if (family.length < 2) {
      setFamily([
        ...family,
        {
          full_name: "",
          phone_number: "",
          email_id: "",
          address: "",
          age: "",
          gender: "",
          blood_group: "",
          isNew: true, // Flag to identify new unsaved family members
        },
      ]);
    }
  }

  function updateFamily(index: number, field: string, value: string) {
    setFamily(
      family.map((f, i) => (i === index ? { ...f, [field]: value } : f))
    );
  }

  async function saveFamily(member: any, index: number) {
    try {
      let result;
      
      if (member.isNew || !member.id) {
        // Create new family member
        console.log("Creating new family member:", member);
        const response = await fetch("/api/profile/family", {
          method: "POST",
          headers,
          body: JSON.stringify({
            full_name: member.full_name,
            phone_number: member.phone_number,
            email_id: member.email_id,
            address: member.address,
            age: member.age ? Number(member.age) : undefined,
            gender: member.gender,
            blood_group: member.blood_group,
          }),
        });
        
        result = await response.json();
        
        if (response.ok) {
          // Update the local family array with the new member data
          const updatedFamily = [...family];
          updatedFamily[index] = {
            ...member,
            id: result.data?.personalInfo?.id || result.data?.user?.id,
            isNew: false
          };
          setFamily(updatedFamily);
        } else {
          console.error("Error creating family member:", result);
        }
      } else {
        // Update existing family member
        console.log("Updating family member:", member);
        const response = await fetch("/api/profile/family", {
          method: "PATCH",
          headers,
          body: JSON.stringify({
            id: member.id,
            full_name: member.full_name,
            phone_number: member.phone_number,
            email_id: member.email_id,
            address: member.address,
            age: member.age ? Number(member.age) : undefined,
            gender: member.gender,
            blood_group: member.blood_group,
          }),
        });
        
        result = await response.json();
        
        if (response.ok) {
        } else {
          console.error("Error updating family member:", result);
        }
      }
    } catch (error) {
      console.error("Error saving family member:", error);
    }
  }

  async function deleteFamily(id: string) {
    try {
      const response = await fetch("/api/profile/family", {
        method: "DELETE",
        headers,
        body: JSON.stringify({ id }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setFamily(family.filter((f) => f.id !== id));
      } else {
        console.error("Error deleting family member:", result);
      }
    } catch (error) {
      console.error("Error deleting family member:", error);
    }
  }

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "medical", label: "Medical Info", icon: Heart },
    { id: "family", label: "Family", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-scanova/primary to-scanova/primary-light mt-14">
      {/* Header with gradient background */}
      <div className="bg-hero-pattern px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-scanova/primary-foreground">Manage your personal and medical information</p>
        </motion.div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto px-6 -mt-4"
      >
        {/* Profile Header Card */}
        <motion.div variants={itemVariants}>
          <Card className="mb-8 overflow-hidden shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative"
                >
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-scanova-gradient p-1">
                    <div className="w-full h-full rounded-full overflow-hidden">
                      <Image
                        src={session?.user?.image || "/default-avatar.png"}
                        alt=" "
                        width={120}
                        height={120}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-scanova/teal w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </motion.div>
                
                <div className="text-center md:text-left flex-1">
                  <h2 className="text-3xl font-bold text-scanova/text-header mb-2">
                    {session?.user?.name || "Welcome, Patient"}
                  </h2>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-scanova/text-body mb-4">
                    <Mail className="w-5 h-5 text-scanova/primary" />
                    <span className="font-medium">{session?.user?.email}</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-scanova/text-body">
                    <div className="flex items-center gap-1">
                      <Shield className="w-4 h-4" />
                      <span>Verified Account</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Activity className="w-4 h-4" />
                      <span>Active Profile</span>
                    </div>
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    className="border-scanova/dark-blue text-scanova/dark-blue hover:bg-scanova/dark-blue/10 hover:border-scanova/dark-blue px-6 py-2 rounded-full"
                    onClick={() => signOut({ callbackUrl: "/login" })}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex justify-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg border border-gray-200/50">
              <div className="flex gap-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                        activeTab === tab.id
                          ? "bg-scanova-gradient text-white shadow-lg"
                          : "text-scanova/text-body hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "personal" && (
            <motion.div
              key="personal"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                <CardHeader className="bg-scanova-gradient text-white">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <User className="w-6 h-6" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-scanova/text-body flex items-center gap-2">
                        <User className="w-4 h-4 text-scanova/primary" />
                        Full Name
                      </label>
                      <Input
                        placeholder="Enter your full name"
                        value={personal.full_name}
                        onChange={(e) =>
                          setPersonal({ ...personal, full_name: e.target.value })
                        }
                        className="border-gray-200 focus:border-scanova/primary focus:ring-scanova/primary/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-scanova/text-body flex items-center gap-2">
                        <Phone className="w-4 h-4 text-scanova/teal" />
                        Phone Number
                      </label>
                      <Input
                        placeholder="Enter your phone number"
                        value={personal.phone_number}
                        onChange={(e) =>
                          setPersonal({ ...personal, phone_number: e.target.value })
                        }
                        className="border-gray-200 focus:border-scanova/primary focus:ring-scanova/primary/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-scanova/text-body flex items-center gap-2">
                        <Mail className="w-4 h-4 text-scanova/primary-light" />
                        Email Address
                      </label>
                      <Input
                        placeholder="Enter your email"
                        value={personal.email_id}
                        onChange={(e) =>
                          setPersonal({ ...personal, email_id: e.target.value })
                        }
                        className="border-gray-200 focus:border-scanova/primary focus:ring-scanova/primary/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-scanova/text-body flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-scanova/dark-blue" />
                        Age
                      </label>
                      <Input
                        placeholder="Enter your age"
                        value={personal.age}
                        onChange={(e) =>
                          setPersonal({ ...personal, age: e.target.value })
                        }
                        className="border-gray-200 focus:border-scanova/primary focus:ring-scanova/primary/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-scanova/text-body">Gender</label>
                      <Input
                        placeholder="Enter your gender"
                        value={personal.gender}
                        onChange={(e) =>
                          setPersonal({ ...personal, gender: e.target.value })
                        }
                        className="border-gray-200 focus:border-scanova/primary focus:ring-scanova/primary/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-scanova/text-body flex items-center gap-2">
                        <Heart className="w-4 h-4 text-scanova/teal" />
                        Blood Group
                      </label>
                      <Input
                        placeholder="Enter your blood group"
                        value={personal.blood_group}
                        onChange={(e) =>
                          setPersonal({ ...personal, blood_group: e.target.value })
                        }
                        className="border-gray-200 focus:border-scanova/primary focus:ring-scanova/primary/20"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-medium text-scanova/text-body flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-scanova/primary" />
                        Address
                      </label>
                      <Textarea
                        placeholder="Enter your address"
                        value={personal.address}
                        onChange={(e) =>
                          setPersonal({ ...personal, address: e.target.value })
                        }
                        className="border-gray-200 focus:border-scanova/primary focus:ring-scanova/primary/20 min-h-[100px]"
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        onClick={savePersonal} 
                        disabled={savingPersonal}
                        className="bg-scanova-gradient hover:bg-scanova/primary-light px-8 py-3 rounded-full font-semibold shadow-lg"
                      >
                        {savingPersonal ? (
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        ) : (
                          <Save className="w-5 h-5 mr-2" />
                        )}
                        Save Personal Info
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === "medical" && (
            <motion.div
              key="medical"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                <CardHeader className="bg-scanova-gradient text-white">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Heart className="w-6 h-6" />
                    Medical Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-scanova/text-body flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-scanova/teal" />
                        Pre-existing Conditions
                      </label>
                      <Textarea
                        placeholder="List any pre-existing medical conditions"
                        value={medical.pre_existing_conditions}
                        onChange={(e) =>
                          setMedical({
                            ...medical,
                            pre_existing_conditions: e.target.value,
                          })
                        }
                        className="border-gray-200 focus:border-scanova/teal focus:ring-scanova/teal/20 min-h-[120px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-scanova/text-body flex items-center gap-2">
                        <Activity className="w-4 h-4 text-scanova/teal" />
                        Chronic Illnesses
                      </label>
                      <Textarea
                        placeholder="List any chronic illnesses"
                        value={medical.chronic_illnesses}
                        onChange={(e) =>
                          setMedical({
                            ...medical,
                            chronic_illnesses: e.target.value,
                          })
                        }
                        className="border-gray-200 focus:border-scanova/teal focus:ring-scanova/teal/20 min-h-[120px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-scanova/text-body flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-scanova/teal" />
                        Allergies
                      </label>
                      <Textarea
                        placeholder="List any allergies (medications, food, environmental)"
                        value={medical.allergies}
                        onChange={(e) =>
                          setMedical({ ...medical, allergies: e.target.value })
                        }
                        className="border-gray-200 focus:border-scanova/teal focus:ring-scanova/teal/20 min-h-[120px]"
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        onClick={saveMedical} 
                        disabled={savingMedical}
                        className="bg-scanova-gradient hover:bg-scanova/teal px-8 py-3 rounded-full font-semibold shadow-lg"
                      >
                        {savingMedical ? (
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        ) : (
                          <Save className="w-5 h-5 mr-2" />
                        )}
                        Save Medical Info
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === "family" && (
            <motion.div
              key="family"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                <CardHeader className="bg-scanova-gradient text-white">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <Users className="w-6 h-6" />
                      Family Members
                    </CardTitle>
                    {family.length < 2 && (
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          variant="ghost" 
                          onClick={addFamily}
                          className="text-white hover:bg-white/20 rounded-full"
                        >
                          <Plus className="w-5 h-5 mr-2" />
                          Add Member
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  {family.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-scanova/text-body mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-scanova/text-header mb-2">No family members added</h3>
                      <p className="text-scanova/text-body mb-6">Add up to 2 family members to your profile</p>
                      <Button onClick={addFamily} className="bg-scanova-gradient hover:bg-scanova/teal px-6 py-3 rounded-full">
                        <Plus className="w-5 h-5 mr-2" />
                        Add First Member
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {family.map((member, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="border border-gray-200 rounded-xl p-6 bg-gradient-to-br from-gray-50 to-white"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-scanova/text-header flex items-center gap-2">
                              <User className="w-5 h-5 text-scanova/teal" />
                              Family Member {idx + 1}
                            </h4>
                            {member.id && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteFamily(member.id)}
                                className="text-scanova/dark-blue hover:bg-scanova/dark-blue/10 rounded-full"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                              placeholder="Full name"
                              value={member.full_name || ""}
                              onChange={(e) =>
                                updateFamily(idx, "full_name", e.target.value)
                              }
                              className="border-gray-200 focus:border-scanova/teal focus:ring-scanova/teal/20"
                            />
                            <Input
                              placeholder="Phone number"
                              value={member.phone_number || ""}
                              onChange={(e) =>
                                updateFamily(idx, "phone_number", e.target.value)
                              }
                              className="border-gray-200 focus:border-scanova/teal focus:ring-scanova/teal/20"
                            />
                            <Input
                              placeholder="Email"
                              value={member.email_id || ""}
                              onChange={(e) =>
                                updateFamily(idx, "email_id", e.target.value)
                              }
                              className="border-gray-200 focus:border-scanova/teal focus:ring-scanova/teal/20"
                            />
                            <Input
                              placeholder="Age"
                              value={member.age || ""}
                              onChange={(e) => updateFamily(idx, "age", e.target.value)}
                              className="border-gray-200 focus:border-scanova/teal focus:ring-scanova/teal/20"
                            />
                            <Input
                              placeholder="Gender"
                              value={member.gender || ""}
                              onChange={(e) =>
                                updateFamily(idx, "gender", e.target.value)
                              }
                              className="border-gray-200 focus:border-scanova/teal focus:ring-scanova/teal/20"
                            />
                            <Input
                              placeholder="Blood group"
                              value={member.blood_group || ""}
                              onChange={(e) =>
                                updateFamily(idx, "blood_group", e.target.value)
                              }
                              className="border-gray-200 focus:border-scanova/teal focus:ring-scanova/teal/20"
                            />
                            <div className="md:col-span-2">
                              <Textarea
                                placeholder="Address"
                                value={member.address || ""}
                                onChange={(e) =>
                                  updateFamily(idx, "address", e.target.value)
                                }
                                className="border-gray-200 focus:border-scanova/teal focus:ring-scanova/teal/20"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end mt-4">
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <Button 
                                onClick={() => saveFamily(member, idx)}
                                className="bg-scanova-gradient hover:bg-scanova/teal px-6 py-2 rounded-full"
                              >
                                <Save className="w-4 h-4 mr-2" />
                                {member.isNew || !member.id ? 'Create Member' : 'Save Member'}
                              </Button>
                            </motion.div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Bottom spacing */}
      <div className="h-20"></div>
    </div>
  );
}
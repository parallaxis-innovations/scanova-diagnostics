"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Shield, CheckCircle, Phone, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function HomeCollectionPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    date: '',
    time: '',
    tests: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customCity, setCustomCity] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [city, setCity] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    // Client-side validation
    const requiredFields = ['name', 'phone', 'city', 'address', 'date', 'time', 'tests'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      setMessage({ 
        type: "error", 
        text: `Please fill in all required fields: ${missingFields.join(', ')}` 
      });
      setIsSubmitting(false);
      return;
    }

    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      setMessage({ type: "error", text: "Please enter a valid phone number" });
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("Submitting form data:", formData);
      
      const res = await fetch("/api/book-collection", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("Response status:", res.status);
      console.log("Response headers:", Object.fromEntries(res.headers));

      // Try to parse response as JSON
      let responseData;
      const contentType = res.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        responseData = await res.json();
        console.log("Response data:", responseData);
      } else {
        const textResponse = await res.text();
        console.log("Non-JSON response:", textResponse);
        throw new Error(`Server returned non-JSON response: ${textResponse}`);
      }

      if (!res.ok) {
        throw new Error(responseData?.message || `HTTP ${res.status}: ${res.statusText}`);
      }

      if (responseData.success) {
        setMessage({ 
          type: "success", 
          text: responseData.message || "✅ Your appointment has been booked successfully!" 
        });
        
        // Reset form
        setFormData({
          name: "",
          phone: "",
          email: "",
          city: "",
          address: "",
          date: "",
          time: "",
          tests: "",
          notes: "",
        });
        setCity("");
        setCustomCity("");
      } else {
        throw new Error(responseData.message || "Booking failed");
      }

    } catch (error) {
      console.error("Form submission error:", error);
      
      let errorMessage = "❌ Something went wrong. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch")) {
          errorMessage = "❌ Network error. Please check your connection and try again.";
        } else if (error.message.includes("JSON")) {
          errorMessage = "❌ Server communication error. Please try again.";
        } else {
          errorMessage = `❌ ${error.message}`;
        }
      }
      
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCityChange = (value: string) => {
    setCity(value);
    if (value !== "other") {
      handleInputChange("city", value);
      setCustomCity("");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const steps = [
    {
      icon: <Calendar className="w-8 h-8 text-scanova-teal" />,
      title: "Book Online",
      description: "Fill out your details and preferred collection time slot"
    },
    {
      icon: <Phone className="w-8 h-8 text-scanova-teal" />,
      title: "We Contact You",
      description: "Our team calls to confirm appointment and address details"
    },
    {
      icon: <Users className="w-8 h-8 text-scanova-teal" />,
      title: "Sample Collection",
      description: "Trained technician visits, collects sample safely with PPE protocols"
    }
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
              Safe, Fast & Free Home Sample Pickup
            </h1>
            <p className="text-xl text-white/90 mb-4">
              (Free collection for orders above ₹500)
            </p>
            <div className="flex justify-center items-center gap-8 flex-wrap">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>PPE Protected</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>Same-Day Reports</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>NABL Accredited</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process Steps */}
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
              3 Simple Steps to Book
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeUpVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="relative">
                  <div className="mx-auto mb-6 w-16 h-16 bg-scanova-teal/10 rounded-full flex items-center justify-center">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-scanova-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-scanova-text-header mb-3">
                  {step.title}
                </h3>
                <p className="text-scanova-text-body">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form */}
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
              Book Your Home Collection
            </h2>
            <p className="text-lg text-scanova-text-body">
              Fill out the form below and we&apos;ll contact you to confirm your
              appointment
            </p>
          </motion.div>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Alert className={`border-2 ${
                message.type === "success" 
                  ? "border-green-200 bg-green-50" 
                  : "border-red-200 bg-red-50"
              }`}>
                <CheckCircle className={`h-4 w-4 ${
                  message.type === "success" ? "text-green-600" : "text-red-600"
                }`} />
                <AlertDescription className={
                  message.type === "success" ? "text-green-800" : "text-red-800"
                }>
                  {message.text}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Card className="p-6">
              <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="mt-1"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="mt-1"
                        placeholder="+91 12345 67890"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="mt-1"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Select required onValueChange={handleCityChange} value={city}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select your city" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mumbai">Mumbai</SelectItem>
                          <SelectItem value="pune">Pune</SelectItem>
                          <SelectItem value="nashik">Nashik</SelectItem>
                          <SelectItem value="aurangabad">Aurangabad</SelectItem>
                          <SelectItem value="nagpur">Nagpur</SelectItem>
                          <SelectItem value="ahmedabad">Ahmedabad</SelectItem>
                          <SelectItem value="surat">Surat</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>

                      {city === "other" && (
                        <Input
                          type="text"
                          placeholder="Enter your city"
                          className="mt-2"
                          value={customCity}
                          onChange={(e) => {
                            setCustomCity(e.target.value);
                            handleInputChange("city", e.target.value);
                          }}
                          required
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Complete Address *</Label>
                    <Textarea
                      id="address"
                      required
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="mt-1"
                      placeholder="Enter your complete address with landmark"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="date">Preferred Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => handleInputChange("date", e.target.value)}
                        className="mt-1"
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Preferred Time Slot *</Label>
                      <Select
                        required
                        onValueChange={(value) => handleInputChange("time", value)}
                        value={formData.time}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Morning (7:00 AM - 11:00 AM)</SelectItem>
                          <SelectItem value="afternoon">Afternoon (11:00 AM - 3:00 PM)</SelectItem>
                          <SelectItem value="evening">Evening (3:00 PM - 7:00 PM)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="tests">Tests Required *</Label>
                    <Textarea
                      id="tests"
                      required
                      value={formData.tests}
                      onChange={(e) => handleInputChange("tests", e.target.value)}
                      className="mt-1"
                      placeholder="Please specify the tests you need (e.g., CBC, Lipid Profile, Blood Sugar, etc.)"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      className="mt-1"
                      placeholder="Any special instructions or medical conditions we should know about"
                      rows={2}
                    />
                  </div>

                  <div className="bg-scanova-primary/5 p-4 rounded-lg">
                    <h4 className="font-semibold text-scanova-text-header mb-2">
                      Important Notes:
                    </h4>
                    <ul className="text-sm text-scanova-text-body space-y-1">
                      <li>• Free home collection for orders above ₹500</li>
                      <li>• Our technician will call you 30 minutes before arrival</li>
                      <li>• Please ensure you&apos;re available at the scheduled time</li>
                      <li>• Fasting requirements will be communicated if necessary</li>
                    </ul>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-scanova-gradient hover:opacity-90 text-white py-3 text-lg font-semibold"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </div>
                    ) : (
                      "Book Appointment"
                    )}
                  </Button>
                </form>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Safety Protocols */}
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
              Safety & Professionalism
            </h2>
            <p className="text-lg text-scanova-text-body max-w-2xl mx-auto">
              All sample collectors use PPE and follow strict hygiene protocols
              for your safety
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="w-12 h-12 text-scanova-teal mx-auto mb-4" />
                <CardTitle>Strict Safety Protocols</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-scanova-text-body">
                  Complete PPE kit including masks, gloves, and sanitizers for
                  every collection
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="w-12 h-12 text-scanova-teal mx-auto mb-4" />
                <CardTitle>Trained Professionals</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-scanova-text-body">
                  Certified phlebotomists with years of experience in sample
                  collection
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Clock className="w-12 h-12 text-scanova-teal mx-auto mb-4" />
                <CardTitle>Timely Service</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-scanova-text-body">
                  Punctual service with real-time tracking and notification
                  updates
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-12 bg-scanova-primary/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-scanova-text-header mb-4">
            Need Help? Contact Us
          </h3>
          <div className="flex justify-center items-center gap-8 flex-wrap">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-scanova-primary" />
              <span className="text-scanova-text-body">+91 12345 67890</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-scanova-primary" />
              <span className="text-scanova-text-body">Available across major cities</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-scanova-dark-blue to-scanova-primary text-white">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="text-2xl font-bold mb-4">
              SCANOVA
              <div className="text-sm font-normal text-gray-200">DIAGNOSTICS</div>
            </div>
            <p className="text-gray-200 mb-4">
              NABL-accredited diagnostic center providing accurate, reliable healthcare 
              services with cutting-edge technology and compassionate care.
            </p>
            <div className="flex gap-4">
              <Facebook size={20} className="hover:text-scanova-teal cursor-pointer transition-colors" />
              <Twitter size={20} className="hover:text-scanova-teal cursor-pointer transition-colors" />
              <Instagram size={20} className="hover:text-scanova-teal cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-200 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/services" className="text-gray-200 hover:text-white transition-colors">Services</Link></li>
              <li><Link href="/packages" className="text-gray-200 hover:text-white transition-colors">Health Packages</Link></li>
              <li><Link href="/home-collection" className="text-gray-200 hover:text-white transition-colors">Home Collection</Link></li>
              <li><Link href="/faq" className="text-gray-200 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/login" className="text-gray-200 hover:text-white transition-colors">Patient Login</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li className="text-gray-200">Pathology Tests</li>
              <li className="text-gray-200">Medical Imaging</li>
              <li className="text-gray-200">Cardiology Diagnostics</li>
              <li className="text-gray-200">Home Sample Collection</li>
              <li className="text-gray-200">Health Packages</li>
              <li className="text-gray-200">Doctor Consultations</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-1 text-scanova-teal" />
                <div className="text-gray-200">
                  62 GT road, Opp. National hotel <br />
                  Howrah, West bengal, 711101
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-scanova-teal" />
                <span className="text-gray-200">+91 90072 04996</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-scanova-teal" />
                <span className="text-gray-200">info@scanovadiagnostics.com</span>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Operating Hours</h4>
              <div className="text-gray-200 text-sm">
                <p>Mon - Sat: 7:00 AM - 9:00 PM</p>
                <p>Sunday: 8:00 AM - 6:00 PM</p>
                <p className="text-scanova-teal font-medium mt-1">Home Collection: 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-200 text-sm">
            © 2024 Scanova Diagnostics. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-200 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-200 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
            <Link href="/disclaimer" className="text-gray-200 hover:text-white text-sm transition-colors">
              Medical Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
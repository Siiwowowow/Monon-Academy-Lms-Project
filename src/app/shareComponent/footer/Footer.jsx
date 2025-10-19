import Image from 'next/image'
import React from 'react'
import brandLogo from '../../../app/assets/logobrand.png';
import { 
  FaFacebook, 
  FaWhatsapp, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
  FaCreditCard,
  FaMobileAlt,
  FaUniversity,
  FaArrowRight
} from 'react-icons/fa';

export default function Footer() {
  return (
    <div className="bg-[#EEEEEE] text-gray-800">
      <footer className="px-6 md:px-16 lg:px-20 pt-10 pb-6 w-full">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-8 border-b border-gray-300">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Logo & Description */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div>
                  <Image 
                  src={brandLogo} 
                  alt="Monon Academy Logo" 
                  className="w-16 h-16 object-contain"
                />
                  <p className="text-sm text-gray-600 leading-relaxed max-w-md">
                    বাংলাদেশের শিক্ষার্থীদের জন্য বিশ্বস্ত অনলাইন শিক্ষা প্ল্যাটফর্ম। 
                    <span className="block mt-1 text-blue-600 font-medium">
                      স্কুল, কলেজ ও বিশ্ববিদ্যালয় ভর্তি প্রস্তুতিতে আমরা আপনার সঙ্গী
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FaPhone className="text-blue-600" size={16} />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">+৮৮০ ১৭০০-১২৩৪৫৬</div>
                  <div className="text-gray-500 text-xs">হটলাইন</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="bg-green-100 p-2 rounded-full">
                  <FaWhatsapp className="text-green-600" size={16} />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">+৮৮০ ১৮১১-৯৮৭৬৫৪</div>
                  <div className="text-gray-500 text-xs">হোয়াটসঅ্যাপ</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="bg-red-100 p-2 rounded-full">
                  <FaEnvelope className="text-red-600" size={16} />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">info@mononacademy.com</div>
                  <div className="text-gray-500 text-xs">ইমেইল</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="bg-purple-100 p-2 rounded-full">
                  <FaMapMarkerAlt className="text-purple-600" size={16} />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">ঢাকা, বাংলাদেশ</div>
                  <div className="text-gray-500 text-xs">ঠিকানা</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider border-l-4 border-blue-500 pl-3">দ্রুত লিংক</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2 group">
                  <FaArrowRight size={10} className="text-blue-500 group-hover:translate-x-1 transition-transform" />
                  হোম
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2 group">
                  <FaArrowRight size={10} className="text-blue-500 group-hover:translate-x-1 transition-transform" />
                  আমাদের সম্পর্কে
                </a>
              </li>
              <li>
                <a href="/courses" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2 group">
                  <FaArrowRight size={10} className="text-blue-500 group-hover:translate-x-1 transition-transform" />
                  কোর্সসমূহ
                </a>
              </li>
              <li>
                <a href="/teachers" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2 group">
                  <FaArrowRight size={10} className="text-blue-500 group-hover:translate-x-1 transition-transform" />
                  শিক্ষকবৃন্দ
                </a>
              </li>
            </ul>
          </div>

          {/* Academic Resources Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider border-l-4 border-green-500 pl-3">একাডেমিক</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="/ssc-preparation" className="text-gray-600 hover:text-green-600 transition-colors block py-1">এসএসসি প্রস্তুতি</a></li>
              <li><a href="/hsc-preparation" className="text-gray-600 hover:text-green-600 transition-colors block py-1">এইচএসসি ভর্তি</a></li>
              <li><a href="/university-admission" className="text-gray-600 hover:text-green-600 transition-colors block py-1">বিশ্ববিদ্যালয় ভর্তি</a></li>
              <li><a href="/medical-admission" className="text-gray-600 hover:text-green-600 transition-colors block py-1">মেডিকেল ভর্তি</a></li>
            </ul>
          </div>

          {/* Newsletter & Payment Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider border-l-4 border-purple-500 pl-3">সাবস্ক্রাইব</h3>
            <div className="space-y-4">
              <div className="space-y-3">
                <input 
                  className="border border-gray-300 bg-white placeholder-gray-500 focus:ring-2 ring-blue-500 outline-none w-full h-10 rounded-lg px-3 text-sm transition-all shadow-sm" 
                  type="email" 
                  placeholder="আপনার ইমেইল ঠিকানা" 
                />
                <button className="bg-blue-600 w-full h-10 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-md">
                  সাবস্ক্রাইব করুন
                </button>
              </div>
              
              {/* Payment Methods */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 text-sm">পেমেন্ট মাধ্যম</h4>
                <div className="flex gap-2">
                  <div className="bg-green-500 text-white p-2 rounded-lg shadow-sm" title="bKash">
                    <FaMobileAlt size={16} />
                  </div>
                  <div className="bg-red-500 text-white p-2 rounded-lg shadow-sm" title="Nagad">
                    <FaMobileAlt size={16} />
                  </div>
                  <div className="bg-purple-500 text-white p-2 rounded-lg shadow-sm" title="Rocket">
                    <FaUniversity size={16} />
                  </div>
                  <div className="bg-blue-900 text-white p-2 rounded-lg shadow-sm" title="Visa">
                    <FaCreditCard size={16} />
                  </div>
                  <div className="bg-red-600 text-white p-2 rounded-lg shadow-sm" title="Mastercard">
                    <FaCreditCard size={16} />
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 text-sm">সোশ্যাল মিডিয়া</h4>
                <div className="flex gap-2">
                  <a href="#" className="bg-blue-600 text-white p-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors">
                    <FaFacebook size={16} />
                  </a>
                  <a href="#" className="bg-green-500 text-white p-2 rounded-lg shadow-sm hover:bg-green-600 transition-colors">
                    <FaWhatsapp size={16} />
                  </a>
                  <a href="#" className="bg-pink-600 text-white p-2 rounded-lg shadow-sm hover:bg-pink-700 transition-colors">
                    <FaInstagram size={16} />
                  </a>
                  <a href="#" className="bg-red-600 text-white p-2 rounded-lg shadow-sm hover:bg-red-700 transition-colors">
                    <FaYoutube size={16} />
                  </a>
                  <a href="#" className="bg-blue-800 text-white p-2 rounded-lg shadow-sm hover:bg-blue-900 transition-colors">
                    <FaLinkedin size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-center md:text-left text-sm text-gray-600">
            © ২০২৫ <a href="/" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">মনন একাডেমি</a>. সকল অধিকার সংরক্ষিত
          </p>
          
          {/* Legal Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="/privacy-policy" className="text-gray-600 hover:text-blue-600 transition-colors">প্রাইভেসি পলিসি</a>
            <a href="/terms-conditions" className="text-gray-600 hover:text-blue-600 transition-colors">শর্তাবলী</a>
            <a href="/refund-policy" className="text-gray-600 hover:text-blue-600 transition-colors">রিফান্ড পলিসি</a>
            <a href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">যোগাযোগ</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
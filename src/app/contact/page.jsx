"use client";

import React, { useState } from "react";
import { Tiro_Bangla } from "next/font/google";
import { 
  FaFacebook, 
  FaWhatsapp, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane,
  FaUser,
  FaCheckCircle
} from "react-icons/fa";

// Load Tiro Bangla font
const tiroBangla = Tiro_Bangla({
  weight: ["400"],
  subsets: ["bengali"],
});

export default function ModernContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
    }, 3000);
  };

  const contactMethods = [
    {
      icon: FaPhone,
      title: "ফোন নম্বর",
      details: ["+৮৮০ ১৭০০-১২৩৪৫৬", "+৮৮০ ১৮০০-৯৮৭৬৫৪"],
      color: "blue",
      link: "tel:+8801700123456"
    },
    {
      icon: FaWhatsapp,
      title: "হোয়াটসঅ্যাপ",
      details: ["+৮৮০ ১৭০০-১২৩৪৫৬", "২৪/৭ সেবা উপলব্ধ"],
      color: "green",
      link: "https://wa.me/8801700123456"
    },
    {
      icon: FaEnvelope,
      title: "ইমেইল",
      details: ["info@example.com", "support@example.com"],
      color: "red",
      link: "mailto:info@example.com"
    },
    {
      icon: FaFacebook,
      title: "ফেসবুক",
      details: ["facebook.com/ourpage", "মেসেজ পাঠান"],
      color: "blue",
      link: "https://facebook.com/ourpage"
    }
  ];

  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    red: "bg-red-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500"
  };

  return (
    <div className={`${tiroBangla.className} min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-8 px-4`}>
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500 rounded-2xl mb-6 shadow-lg">
            <FaPaperPlane className="text-2xl text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            যোগাযোগ করুন
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            আপনার যেকোনো প্রয়োজনে আমরা এখানে আছি। নিচের ফর্ম পূরণ করুন অথবা সরাসরি আমাদের সাথে যোগাযোগ করুন।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* Contact Form Section */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-800">মেসেজ পাঠান</h2>
            </div>

            {isSubmitted ? (
              <div className="text-center py-12">
                <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">মেসেজ সফলভাবে পাঠানো হয়েছে!</h3>
                <p className="text-gray-600">আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <FaUser className="text-gray-400" />
                      আপনার নাম
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                      placeholder="আপনার পুরো নাম লিখুন"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <FaEnvelope className="text-gray-400" />
                      ইমেইল ঠিকানা
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">ফোন নম্বর</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                    placeholder="+৮৮০ ১৭০০-১২৩৪৫৬"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">বিষয়</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                    placeholder="মেসেজের বিষয় লিখুন"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">মেসেজ</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none resize-none"
                    placeholder="আপনার মেসেজ বিস্তারিত লিখুন..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3 ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      পাঠানো হচ্ছে...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      মেসেজ পাঠান
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Contact Information Section */}
          <div className="space-y-6">
            {/* Contact Methods Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contactMethods.map((method, index) => (
                <a
                  key={index}
                  href={method.link}
                  target={method.link.startsWith('http') ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
                >
                  <div className={`w-12 h-12 ${colorClasses[method.color]} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <method.icon className="text-xl text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2 text-lg">{method.title}</h3>
                  {method.details.map((detail, idx) => (
                    <p key={idx} className={`text-gray-600 ${idx === 0 ? 'text-base' : 'text-sm'}`}>
                      {detail}
                    </p>
                  ))}
                </a>
              ))}
            </div>

            {/* Additional Info Card */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white shadow-xl">
              <div className="flex items-start gap-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <FaMapMarkerAlt className="text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">আমাদের ঠিকানা</h3>
                  <p className="text-blue-50 leading-relaxed">
                    ১২৩/ক, ব্যবসায়িক সড়ক, <br />
                    ঢাকা-১২১২, বাংলাদেশ
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 mt-6">
                <div className="bg-white/20 p-3 rounded-xl">
                  <FaClock className="text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">অফিস সময়</h3>
                  <p className="text-blue-50 leading-relaxed">
                    শনি - বৃহস্পতিবার: সকাল ৯:০০ - রাত ১০:০০ <br />
                    <span className="text-white/80">শুক্রবার বন্ধ</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
            সোশ্যাল মিডিয়াতে অনুসরণ করুন
          </h2>
          <div className="flex justify-center gap-6 flex-wrap">
            {contactMethods.slice(0, 4).map((method, index) => (
              <a
                key={index}
                href={method.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`${colorClasses[method.color]} text-white p-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 flex items-center gap-3 min-w-[140px] justify-center`}
              >
                <method.icon className="text-xl" />
                <span className="font-medium">{method.title}</span>
              </a>
            ))}
          </div>
        </div>

        
        
      </div>
    </div>
  );
}
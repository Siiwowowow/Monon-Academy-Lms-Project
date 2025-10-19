'use client'
import React from 'react'
import { Tiro_Bangla } from 'next/font/google'
import { 
  FaRocket, 
  FaShieldAlt, 
  FaUserTie, 
  FaMobileAlt,
  FaArrowRight,
  FaCrown,
  FaAward,
  FaLightbulb
} from 'react-icons/fa'

// Load Tiro Bangla font
const tiroBangla = Tiro_Bangla({
  weight: ["400"],
  subsets: ["bengali"],
})

const CallToAction = () => {
  const benefits = [
    {
      icon: FaRocket,
      title: "দ্রুত শিখন প্রক্রিয়া",
      description: "আমাদের স্মার্ট কারিকুলাম দিয়ে কম সময়ে বেশি শিখুন"
    },
    {
      icon: FaShieldAlt,
      title: "১০০% সুরক্ষিত প্ল্যাটফর্ম",
      description: "আপনার ডেটা এবং প্রাইভেসি সম্পূর্ণ সুরক্ষিত"
    },
    {
      icon: FaUserTie,
      title: "ক্যারিয়ার গাইডেন্স",
      description: "এক্সপার্টদের থেকে ক্যারিয়ার কাউন্সেলিং"
    },
    {
      icon: FaMobileAlt,
      title: "মোবাইল অ্যাপ এক্সেস",
      description: "যেকোনো ডিভাইস থেকে অ্যাক্সেস করুন"
    }
  ]

  const successStats = [
    { number: "৯৫%", label: "কোর্স সম্পূর্ণ হার" },
    { number: "৪.৯/৫", label: "শিক্ষার্থী রেটিং" },
    { number: "১০০+", label: "লাইভ প্রোজেক্ট" },
    { number: "২৪/৭", label: "মেন্টর সাপোর্ট" }
  ]

  return (
    <div className={`${tiroBangla.className} py-16 px-4 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 relative overflow-hidden`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-80 h-80 bg-white rounded-full mix-blend-overlay filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-200 rounded-full mix-blend-overlay filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Content Section */}
          <div className="text-white">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/30">
              <FaCrown className="text-yellow-300" />
              <span>প্রিমিয়াম লার্নিং এক্সপেরিয়েন্স</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              আপনার 
              <span className="text-gray-900"> স্কিল ডেভেলপমেন্ট</span> 
              <br />
              যাত্রা শুরু করুন
            </h1>

            {/* Description */}
            <p className="text-lg text-amber-100 mb-8 leading-relaxed">
              শিখুন industry experts এর থেকে, বিল্ড করুন real-world projects, 
              এবং পাচ্ছেন lifetime access। আপনার dream career এর জন্য প্রস্তুত হোন আজই!
            </p>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                  <div className="bg-white text-orange-500 p-2 rounded-lg">
                    <benefit.icon className="text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm mb-1">{benefit.title}</h3>
                    <p className="text-amber-100 text-xs">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-gray-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 shadow-2xl">
                <FaLightbulb className="text-yellow-400" />
                ফ্রী ক্লাস শুরু করুন
                <FaArrowRight className="transition-transform group-hover:translate-x-1" />
              </button>
              
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-sm">
                <FaAward />
                সিলেবাস দেখুন
              </button>
            </div>
          </div>

          {/* Visual Section */}
          <div className="relative">
            {/* Main Card */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-white/20 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              
              {/* Premium Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-6 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2">
                  <FaCrown />
                  MOST POPULAR
                </div>
              </div>

              {/* Card Header */}
              <div className="text-center mb-6 pt-4">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-1 mb-4">
                  <div className="bg-white rounded-xl p-6 text-center">
                    <div className="text-2xl font-bold text-gray-800 mb-2">ফুল স্ট্যাক ডেভেলপমেন্ট</div>
                    <div className="text-sm text-gray-600">৬ মাসের কমপ্রিহেনসিভ কোর্স</div>
                  </div>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="bg-amber-500 text-white p-2 rounded-lg">
                    <FaRocket className="text-sm" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">৫০+ রিয়েল প্রোজেক্ট</div>
                    <div className="text-gray-600 text-xs">হ্যান্ডস-অন এক্সপেরিয়েন্স</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="bg-orange-500 text-white p-2 rounded-lg">
                    <FaUserTie className="text-sm" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">১-on-১ মেন্টরশিপ</div>
                    <div className="text-gray-600 text-xs">Industry Experts</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="bg-red-500 text-white p-2 rounded-lg">
                    <FaAward className="text-sm" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">জব প্লেসমেন্ট সাপোর্ট</div>
                    <div className="text-gray-600 text-xs">গ্যারান্টিড ইন্টারভিউ</div>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200">
                <div className="flex items-center justify-center gap-4 mb-2">
                  <span className="text-gray-500 line-through text-lg">৳ ২৫,০০০</span>
                  <span className="text-2xl font-bold text-gray-800">৳ ১৫,০০০</span>
                </div>
                <div className="text-green-600 font-semibold text-sm">৪০% ছাড়! সীমিত সময়ের জন্য</div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>সিট বুকিং</span>
                  <span>৬৫% বুকড</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: '65%' }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg animate-bounce">
              ⚡ ৬৫% বুকড
            </div>
            <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
              🎯 ৯৫% সাকসেস
            </div>
          </div>
        </div>

        {/* Success Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-8 border-t border-white/20">
          {successStats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-amber-200 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
            <FaShieldAlt className="text-green-400" />
            <span className="text-amber-100 text-sm">১০০% মানি ব্যাক গ্যারান্টি - ৭ দিনের মধ্যে</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-bounce {
          animation: bounce 2s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  )
}

export default CallToAction
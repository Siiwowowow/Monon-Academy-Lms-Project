'use client'
import React from 'react'
import { Tiro_Bangla } from 'next/font/google'
import { FaRegClock, FaUsers, FaCertificate, FaArrowRight } from 'react-icons/fa'

// Load Tiro Bangla font
const tiroBangla = Tiro_Bangla({
  weight: ["400"],
  subsets: ["bengali"],
})

const OfferBanner = () => {
  return (
    <div className={`${tiroBangla.className} py-8 px-4 bg-gradient-to-r from-[#B77466] via-[#16476A] to-[#132440] relative overflow-hidden`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-48 h-48 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          
          {/* Content Section */}
          <div className="text-white">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium mb-4">
              <FaRegClock className="text-yellow-300" />
              <span>সীমিত সময়ের অফার!</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
              বিশেষ 
              <span className="text-yellow-300"> ৫০% ছাড়</span> 
              <br />
              সকল কোর্সে
            </h1>

            {/* Description */}
            <p className="text-sm md:text-base text-blue-100 mb-6 leading-relaxed">
              এই মাসের বিশেষ অফারে সকল একাডেমিক কোর্সে পাচ্ছেন ৫০% পর্যন্ত ছাড়। 
              স্কুল, কলেজ ও বিশ্ববিদ্যালয় ভর্তি প্রস্তুতির জন্য এখনই এনরোল করুন।
            </p>

            {/* Countdown Timer - Compact */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/20">
              <p className="text-blue-100 mb-3 text-center text-sm">অফার শেষ হতে বাকি:</p>
              <div className="flex justify-center gap-2 text-center">
                <div className="bg-white/20 rounded-lg p-2 min-w-12">
                  <div className="text-lg font-bold text-white">০৩</div>
                  <div className="text-xs text-blue-100">দিন</div>
                </div>
                <div className="bg-white/20 rounded-lg p-2 min-w-12">
                  <div className="text-lg font-bold text-white">১৫</div>
                  <div className="text-xs text-blue-100">ঘন্টা</div>
                </div>
                <div className="bg-white/20 rounded-lg p-2 min-w-12">
                  <div className="text-lg font-bold text-white">৪২</div>
                  <div className="text-xs text-blue-100">মিনিট</div>
                </div>
              </div>
            </div>

            {/* Features - Compact */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-1 rounded">
                  <FaUsers className="text-white text-sm" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">১০K+</div>
                  <div className="text-blue-100 text-xs">শিক্ষার্থী</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-1 rounded">
                  <FaCertificate className="text-white text-sm" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">১০০%</div>
                  <div className="text-blue-100 text-xs">সার্টিফিকেট</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-1 rounded">
                  <FaRegClock className="text-white text-sm" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">২৪/৭</div>
                  <div className="text-blue-100 text-xs">সাপোর্ট</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons - Compact */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="bg-yellow-400 text-[#132440] px-6 py-3 rounded-lg font-bold text-base hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                এখনই এনরোল করুন
                <FaArrowRight className="text-sm" />
              </button>
              <button className="border border-white text-white px-6 py-3 rounded-lg font-bold text-base hover:bg-white/10 transition-all duration-300">
                কোর্স দেখুন
              </button>
            </div>
          </div>

          {/* Visual Section - Compact */}
          <div className="relative">
            {/* Main Card */}
            <div className="bg-white rounded-2xl p-4 shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="bg-gradient-to-br from-[#B77466] to-[#16476A] rounded-xl p-1 mb-3">
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-gray-800 mb-1">৫০% OFF</div>
                  <div className="text-xs text-gray-600">সকল একাডেমিক কোর্সে</div>
                </div>
              </div>
              
              {/* Course List - Compact */}
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                  <span className="text-gray-700 text-sm">এসএসসি প্রস্তুতি</span>
                  <div className="flex gap-1">
                    <span className="text-gray-500 line-through text-xs">৳ ৪,০০০</span>
                    <span className="text-green-600 font-bold text-sm">৳ ২,০০০</span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                  <span className="text-gray-700 text-sm">এইচএসসি ভর্তি</span>
                  <div className="flex gap-1">
                    <span className="text-gray-500 line-through text-xs">৳ ৫,০০০</span>
                    <span className="text-green-600 font-bold text-sm">৳ ২,৫০০</span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                  <span className="text-gray-700 text-sm">বিশ্ববিদ্যালয় ভর্তি</span>
                  <div className="flex gap-1">
                    <span className="text-gray-500 line-through text-xs">৳ ৬,০০০</span>
                    <span className="text-green-600 font-bold text-sm">৳ ৩,০০০</span>
                  </div>
                </div>
              </div>

              {/* Offer Note - Compact */}
              <div className="mt-3 p-2 bg-yellow-50 rounded-md border border-yellow-200">
                <p className="text-xs text-yellow-800 text-center">
                  🎓 প্রথম ১০০ জনের জন্য অতিরিক্ত ১০% ছাড়
                </p>
              </div>
            </div>

            {/* Floating Elements - Smaller */}
            <div className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-1 rounded-full font-bold text-xs">
              ৭৫ জন এনরোল করেছেন
            </div>
            <div className="absolute -bottom-2 -left-2 bg-green-500 text-white px-2 py-1 rounded-full font-bold text-xs">
              ⭐ ৪.৯/৫
            </div>
          </div>
        </div>

        {/* Bottom Stats - Compact */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/20">
          <div className="text-center">
            <div className="text-xl font-bold text-white mb-1">৫০০+</div>
            <div className="text-blue-100 text-xs">সক্রিয় কোর্স</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-white mb-1">৯৮%</div>
            <div className="text-blue-100 text-xs">সাফল্যের হার</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-white mb-1">৫০+</div>
            <div className="text-blue-100 text-xs">শিক্ষক</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-white mb-1">২৪/৭</div>
            <div className="text-blue-100 text-xs">সাপোর্ট</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OfferBanner
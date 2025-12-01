'use client'
import React, { useState, useEffect } from 'react'
import { Tiro_Bangla } from 'next/font/google'
import { FaRegClock, FaUsers, FaCertificate, FaArrowRight, FaFire } from 'react-icons/fa'
import Link from 'next/link'

// Load Tiro Bangla font
const tiroBangla = Tiro_Bangla({
  weight: ["400"],
  subsets: ["bengali"],
})

const OfferBanner = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 15,
    minutes: 42,
    seconds: 0
  })
  const [hasExpired, setHasExpired] = useState(false)

  // Function to reset timer to initial values
  const resetTimer = () => {
    setTimeLeft({
      days: 3,
      hours: 15,
      minutes: 42,
      seconds: 0
    })
    setHasExpired(false)
  }

  // Countdown timer effect
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setTimeLeft(prev => {
        // Copy the previous state
        const newTime = { ...prev }

        // Decrease seconds
        if (newTime.seconds > 0) {
          newTime.seconds -= 1
        } else {
          // If seconds reach 0, move to minutes
          if (newTime.minutes > 0) {
            newTime.minutes -= 1
            newTime.seconds = 59
          } else {
            // If minutes reach 0, move to hours
            if (newTime.hours > 0) {
              newTime.hours -= 1
              newTime.minutes = 59
              newTime.seconds = 59
            } else {
              // If hours reach 0, move to days
              if (newTime.days > 0) {
                newTime.days -= 1
                newTime.hours = 23
                newTime.minutes = 59
                newTime.seconds = 59
              } else {
                // Timer has expired
                clearInterval(countdownInterval)
                setHasExpired(true)
                
                // Reset timer after 3 seconds
                setTimeout(() => {
                  resetTimer()
                }, 3000)

                return {
                  days: 0,
                  hours: 0,
                  minutes: 0,
                  seconds: 0
                }
              }
            }
          }
        }

        return newTime
      })
    }, 1000)

    // Cleanup interval on component unmount
    return () => clearInterval(countdownInterval)
  }, [hasExpired])

  return (
    <div className={`${tiroBangla.className} mt-10 py-8 px-4 bg-gradient-to-r from-[#B77466] via-[#16476A] to-[#132440] relative overflow-hidden`}>
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
              <span>{hasExpired ? 'অফার শেষ!' : 'সীমিত সময়ের অফার!'}</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
              {hasExpired ? (
                <>
                  নতুন অফার 
                  <span className="text-yellow-300"> চলছে!</span>
                  <br />
                  এখনই এনরোল করুন
                </>
              ) : (
                <>
                  বিশেষ 
                  <span className="text-yellow-300"> ৫০% ছাড়</span> 
                  <br />
                  সকল কোর্সে
                </>
              )}
            </h1>

            {/* Description */}
            <p className="text-sm md:text-base text-blue-100 mb-6 leading-relaxed">
              {hasExpired 
                ? 'নতুন বিশেষ অফার চালু হয়েছে! স্কুল, কলেজ ও বিশ্ববিদ্যালয় ভর্তি প্রস্তুতির জন্য এখনই এনরোল করুন।'
                : 'এই মাসের বিশেষ অফারে সকল একাডেমিক কোর্সে পাচ্ছেন ৫০% পর্যন্ত ছাড়। স্কুল, কলেজ ও বিশ্ববিদ্যালয় ভর্তি প্রস্তুতির জন্য এখনই এনরোল করুন।'
              }
            </p>

            {/* Countdown Timer - Compact */}
            <div className={`bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 border ${hasExpired ? 'border-red-300/30' : 'border-white/20'}`}>
              <p className="text-blue-100 mb-3 text-center text-sm">
                {hasExpired ? 'নতুন অফার শুরু হতে বাকি:' : 'অফার শেষ হতে বাকি:'}
              </p>
              {hasExpired ? (
                <div className="flex justify-center items-center gap-2">
                  <FaFire className="text-yellow-400 animate-pulse text-xl" />
                  <span className="text-lg font-bold text-white animate-pulse">
                    নতুন অফার শুরু হচ্ছে...
                  </span>
                  <FaFire className="text-yellow-400 animate-pulse text-xl" />
                </div>
              ) : (
                <div className="flex justify-center gap-2 text-center">
                  <div className="bg-white/20 rounded-lg p-2 min-w-12">
                    <div className={`text-lg font-bold ${timeLeft.days === 0 ? 'text-red-400' : 'text-white'}`}>
                      {timeLeft.days.toString().padStart(2, '0')}
                    </div>
                    <div className="text-xs text-blue-100">দিন</div>
                  </div>
                  <div className="text-white font-bold pt-3">:</div>
                  <div className="bg-white/20 rounded-lg p-2 min-w-12">
                    <div className={`text-lg font-bold ${timeLeft.hours === 0 && timeLeft.days === 0 ? 'text-red-400' : 'text-white'}`}>
                      {timeLeft.hours.toString().padStart(2, '0')}
                    </div>
                    <div className="text-xs text-blue-100">ঘন্টা</div>
                  </div>
                  <div className="text-white font-bold pt-3">:</div>
                  <div className="bg-white/20 rounded-lg p-2 min-w-12">
                    <div className={`text-lg font-bold ${timeLeft.minutes === 0 && timeLeft.hours === 0 && timeLeft.days === 0 ? 'text-red-400' : 'text-white'}`}>
                      {timeLeft.minutes.toString().padStart(2, '0')}
                    </div>
                    <div className="text-xs text-blue-100">মিনিট</div>
                  </div>
                  <div className="text-white font-bold pt-3">:</div>
                  <div className="bg-white/20 rounded-lg p-2 min-w-12">
                    <div className={`text-lg font-bold ${timeLeft.seconds < 10 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                      {timeLeft.seconds.toString().padStart(2, '0')}
                    </div>
                    <div className="text-xs text-blue-100">সেকেন্ড</div>
                  </div>
                </div>
              )}
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
              <Link href="/courses">
                <button className="bg-yellow-400 text-[#132440] px-6 py-3 rounded-lg font-bold text-base hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                  {hasExpired ? 'নতুন অফার দেখুন' : 'এখনই এনরোল করুন'}
                  <FaArrowRight className="text-sm" />
                </button>
              </Link>
              <button className="border border-white text-white px-6 py-3 rounded-lg font-bold text-base hover:bg-white/10 transition-all duration-300">
                কোর্স দেখুন
              </button>
            </div>
          </div>

          {/* Visual Section - Compact */}
          <div className="relative">
            {/* Main Card */}
            <div className={`bg-white rounded-2xl p-4 shadow-xl transform ${hasExpired ? 'animate-bounce' : 'rotate-2 hover:rotate-0'} transition-all duration-500`}>
              <div className={`rounded-xl p-1 mb-3 ${hasExpired ? 'bg-gradient-to-br from-red-500 to-orange-500' : 'bg-gradient-to-br from-[#B77466] to-[#16476A]'}`}>
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className={`text-2xl font-bold mb-1 ${hasExpired ? 'text-red-600' : 'text-gray-800'}`}>
                    {hasExpired ? 'নতুন অফার!' : '৫০% OFF'}
                  </div>
                  <div className="text-xs text-gray-600">
                    {hasExpired ? 'নতুন কোর্স যুক্ত হয়েছে' : 'সকল একাডেমিক কোর্সে'}
                  </div>
                </div>
              </div>
              
              {/* Course List - Compact */}
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                  <span className="text-gray-700 text-sm">এসএসসি প্রস্তুতি</span>
                  <div className="flex gap-1">
                    <span className="text-gray-500 line-through text-xs">৳ ৪,০০০</span>
                    <span className={`font-bold text-sm ${hasExpired ? 'text-blue-600' : 'text-green-600'}`}>
                      {hasExpired ? '৳ ২,২০০' : '৳ ২,০০০'}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                  <span className="text-gray-700 text-sm">এইচএসসি ভর্তি</span>
                  <div className="flex gap-1">
                    <span className="text-gray-500 line-through text-xs">৳ ৫,০০০</span>
                    <span className={`font-bold text-sm ${hasExpired ? 'text-blue-600' : 'text-green-600'}`}>
                      {hasExpired ? '৳ ২,৭৫০' : '৳ ২,৫০০'}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                  <span className="text-gray-700 text-sm">বিশ্ববিদ্যালয় ভর্তি</span>
                  <div className="flex gap-1">
                    <span className="text-gray-500 line-through text-xs">৳ ৬,০০০</span>
                    <span className={`font-bold text-sm ${hasExpired ? 'text-blue-600' : 'text-green-600'}`}>
                      {hasExpired ? '৳ ৩,২০০' : '৳ ৩,০০০'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Offer Note - Compact */}
              <div className={`mt-3 p-2 rounded-md border text-xs text-center ${
                hasExpired 
                  ? 'bg-blue-50 border-blue-200 text-blue-800'
                  : 'bg-yellow-50 border-yellow-200 text-yellow-800'
              }`}>
                <p>
                  {hasExpired 
                    ? '🎉 নতুন সেশন শুরু! প্রথম ৫০ জনের জন্য ফ্রি মক টেস্ট'
                    : '🎓 প্রথম ১০০ জনের জন্য অতিরিক্ত ১০% ছাড়'
                  }
                </p>
              </div>
            </div>

            {/* Floating Elements - Smaller */}
            <div className={`absolute -top-2 -right-2 text-white px-2 py-1 rounded-full font-bold text-xs ${
              hasExpired ? 'bg-blue-500' : 'bg-red-500'
            }`}>
              {hasExpired ? 'নতুন অফার!' : '৭৫ জন এনরোল করেছেন'}
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
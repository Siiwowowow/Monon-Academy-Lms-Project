'use client'
import React, { useState, useEffect } from 'react'
import { Tiro_Bangla } from 'next/font/google'
<<<<<<< HEAD
import { FaRegClock, FaUsers, FaCertificate, FaArrowRight } from 'react-icons/fa'
import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'
=======
import { FaRegClock, FaUsers, FaCertificate, FaArrowRight, FaFire } from 'react-icons/fa'
import Link from 'next/link'
>>>>>>> 1f8092dc2fb7b1b2fa1c001e680496553551d87b

// Load Tiro Bangla font
const tiroBangla = Tiro_Bangla({
  weight: ["400"],
  subsets: ["bengali"],
})

const OfferBanner = () => {
<<<<<<< HEAD
  const [days, setDays] = useState(3);
  const [hours, setHours] = useState(15);
  const [minutes, setMinutes] = useState(42);
  const [seconds, setSeconds] = useState(0);
  const [enrolledCount, setEnrolledCount] = useState(75);
  const [animatedEnrolled, setAnimatedEnrolled] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  // Intersection observer for animations
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev > 0) return prev - 1;
        
        setMinutes(prev => {
          if (prev > 0) return prev - 1;
          
          setHours(prev => {
            if (prev > 0) return prev - 1;
            
            setDays(prev => {
              if (prev > 0) return prev - 1;
              clearInterval(interval);
              return 0;
            });
            return 0;
          });
          return 59;
        });
        return 59;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Animate enrolled counter when in view
  useEffect(() => {
    if (inView && !animatedEnrolled) {
      setTimeout(() => {
        setEnrolledCount(prev => prev + 1);
        setAnimatedEnrolled(true);
      }, 1000);
      
      // Show floating animation
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 2000);
    }
  }, [inView, animatedEnrolled]);

  // Format numbers with leading zero
  const formatNumber = (num) => num.toString().padStart(2, '0');

  // Floating animation component
  const FloatingAnimation = ({ count }) => {
    const [positions, setPositions] = useState([]);

    useEffect(() => {
      if (showAnimation) {
        const newPositions = Array.from({ length: 5 }, () => ({
          x: Math.random() * 100,
          y: Math.random() * 100,
          id: Math.random()
        }));
        setPositions(newPositions);

        const timeout = setTimeout(() => setPositions([]), 1000);
        return () => clearTimeout(timeout);
      }
    }, [showAnimation]);

    return (
      <>
        {positions.map((pos) => (
          <div
            key={pos.id}
            className="absolute text-green-400 font-bold text-lg animate-float pointer-events-none"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              animationDelay: `${Math.random() * 0.5}s`
            }}
          >
            +1
          </div>
        ))}
      </>
    );
  };

  return (
    <div 
      ref={ref}
      className={`${tiroBangla.className} py-8 px-4 bg-gradient-to-r from-[#B77466] via-[#16476A] to-[#132440] relative overflow-hidden`}
    >
      {/* Add custom animations */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes float {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-50px) scale(1.2); opacity: 0; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0) rotate(2deg); }
          50% { transform: translateY(-10px) rotate(0deg); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 10px rgba(255, 255, 255, 0.3); }
          50% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.6); }
        }
        .animate-pulse-slow {
          animation: pulse 2s infinite;
        }
        .animate-float {
          animation: float 1s ease-out forwards;
        }
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
        .animate-glow {
          animation: glow 2s infinite;
        }
      `}</style>

=======
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
>>>>>>> 1f8092dc2fb7b1b2fa1c001e680496553551d87b
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-48 h-48 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full translate-x-1/2 translate-y-1/2 animate-pulse-slow"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          
          {/* Content Section */}
          <div className="text-white">
<<<<<<< HEAD
            {/* Badge with animation */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium mb-4 animate-glow">
              <FaRegClock className="text-yellow-300 animate-spin-slow" />
              <span className="animate-pulse-slow">সীমিত সময়ের অফার!</span>
=======
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium mb-4">
              <FaRegClock className="text-yellow-300" />
              <span>{hasExpired ? 'অফার শেষ!' : 'সীমিত সময়ের অফার!'}</span>
>>>>>>> 1f8092dc2fb7b1b2fa1c001e680496553551d87b
            </div>

            {/* Main Heading */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
<<<<<<< HEAD
              বিশেষ 
              <span className="text-yellow-300 animate-pulse-slow"> ৫০% ছাড়</span> 
              <br />
              সকল কোর্সে
=======
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
>>>>>>> 1f8092dc2fb7b1b2fa1c001e680496553551d87b
            </h1>

            {/* Description */}
            <p className="text-sm md:text-base text-blue-100 mb-6 leading-relaxed">
              {hasExpired 
                ? 'নতুন বিশেষ অফার চালু হয়েছে! স্কুল, কলেজ ও বিশ্ববিদ্যালয় ভর্তি প্রস্তুতির জন্য এখনই এনরোল করুন।'
                : 'এই মাসের বিশেষ অফারে সকল একাডেমিক কোর্সে পাচ্ছেন ৫০% পর্যন্ত ছাড়। স্কুল, কলেজ ও বিশ্ববিদ্যালয় ভর্তি প্রস্তুতির জন্য এখনই এনরোল করুন।'
              }
            </p>

<<<<<<< HEAD
            {/* Countdown Timer with animations */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/20">
              <p className="text-blue-100 mb-3 text-center text-sm">অফার শেষ হতে বাকি:</p>
              <div className="flex justify-center gap-3 text-center">
                <div className="bg-white/20 rounded-lg p-3 min-w-14 transform transition-all duration-300 hover:scale-110 hover:bg-white/30">
                  <div className="text-xl font-bold text-white animate-pulse-slow">
                    {formatNumber(days)}
                  </div>
                  <div className="text-xs text-blue-100 mt-1">দিন</div>
                </div>
                <div className="flex items-center text-white text-lg">:</div>
                <div className="bg-white/20 rounded-lg p-3 min-w-14 transform transition-all duration-300 hover:scale-110 hover:bg-white/300">
                  <div className="text-xl font-bold text-white">
                    {formatNumber(hours)}
                  </div>
                  <div className="text-xs text-blue-100 mt-1">ঘন্টা</div>
                </div>
                <div className="flex items-center text-white text-lg">:</div>
                <div className="bg-white/20 rounded-lg p-3 min-w-14 transform transition-all duration-300 hover:scale-110 hover:bg-white/300">
                  <div className="text-xl font-bold text-white">
                    {formatNumber(minutes)}
                  </div>
                  <div className="text-xs text-blue-100 mt-1">মিনিট</div>
                </div>
                <div className="flex items-center text-white text-lg">:</div>
                <div className="bg-white/20 rounded-lg p-3 min-w-14 transform transition-all duration-300 hover:scale-110 hover:bg-white/300">
                  <div className="text-xl font-bold text-white">
                    {formatNumber(seconds)}
                  </div>
                  <div className="text-xs text-blue-100 mt-1">সেকেন্ড</div>
                </div>
              </div>
=======
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
>>>>>>> 1f8092dc2fb7b1b2fa1c001e680496553551d87b
            </div>

            {/* Features with animated counters */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
                <div className="bg-white/20 p-2 rounded">
                  <FaUsers className="text-white" />
                </div>
                <div>
                  <div className="text-white font-bold text-lg">
                    <CountUp 
                      end={10000} 
                      duration={3} 
                      separator="," 
                      suffix="+" 
                    />
                  </div>
                  <div className="text-blue-100 text-xs">শিক্ষার্থী</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
                <div className="bg-white/20 p-2 rounded">
                  <FaCertificate className="text-white" />
                </div>
                <div>
                  <div className="text-white font-bold text-lg">
                    <CountUp end={100} duration={3} suffix="%" />
                  </div>
                  <div className="text-blue-100 text-xs">সার্টিফিকেট</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
                <div className="bg-white/20 p-2 rounded">
                  <FaRegClock className="text-white" />
                </div>
                <div>
                  <div className="text-white font-bold text-lg">২৪/৭</div>
                  <div className="text-blue-100 text-xs">সাপোর্ট</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
<<<<<<< HEAD
              <button 
                className="bg-yellow-400 text-[#132440] px-6 py-3 rounded-lg font-bold text-base hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 animate-bounce-slow"
                onClick={() => {
                  // Add enrollment animation
                  setEnrolledCount(prev => prev + 1);
                  setShowAnimation(true);
                  setTimeout(() => setShowAnimation(false), 1000);
                }}
              >
                এখনই এনরোল করুন
                <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="border border-white text-white px-6 py-3 rounded-lg font-bold text-base hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95">
=======
              <Link href="/courses">
                <button className="bg-yellow-400 text-[#132440] px-6 py-3 rounded-lg font-bold text-base hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                  {hasExpired ? 'নতুন অফার দেখুন' : 'এখনই এনরোল করুন'}
                  <FaArrowRight className="text-sm" />
                </button>
              </Link>
              <button className="border border-white text-white px-6 py-3 rounded-lg font-bold text-base hover:bg-white/10 transition-all duration-300">
>>>>>>> 1f8092dc2fb7b1b2fa1c001e680496553551d87b
                কোর্স দেখুন
              </button>
            </div>
          </div>

          {/* Visual Section */}
          <div className="relative">
            {/* Floating animations */}
            <FloatingAnimation count={enrolledCount} />
            
            {/* Main Card */}
<<<<<<< HEAD
            <div className="bg-white rounded-2xl p-4 shadow-xl transform rotate-2 hover:rotate-0 transition-all duration-500 animate-bounce-slow">
              <div className="bg-gradient-to-br from-[#B77466] to-[#16476A] rounded-xl p-1 mb-3 animate-glow">
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-gray-800 mb-1 animate-pulse-slow">৫০% OFF</div>
                  <div className="text-xs text-gray-600">সকল একাডেমিক কোর্সে</div>
=======
            <div className={`bg-white rounded-2xl p-4 shadow-xl transform ${hasExpired ? 'animate-bounce' : 'rotate-2 hover:rotate-0'} transition-all duration-500`}>
              <div className={`rounded-xl p-1 mb-3 ${hasExpired ? 'bg-gradient-to-br from-red-500 to-orange-500' : 'bg-gradient-to-br from-[#B77466] to-[#16476A]'}`}>
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className={`text-2xl font-bold mb-1 ${hasExpired ? 'text-red-600' : 'text-gray-800'}`}>
                    {hasExpired ? 'নতুন অফার!' : '৫০% OFF'}
                  </div>
                  <div className="text-xs text-gray-600">
                    {hasExpired ? 'নতুন কোর্স যুক্ত হয়েছে' : 'সকল একাডেমিক কোর্সে'}
                  </div>
>>>>>>> 1f8092dc2fb7b1b2fa1c001e680496553551d87b
                </div>
              </div>
              
              {/* Course List */}
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-all duration-300 hover:scale-[1.02]">
                  <span className="text-gray-700 text-sm">এসএসসি প্রস্তুতি</span>
                  <div className="flex gap-1">
                    <span className="text-gray-500 line-through text-xs">৳ ৪,০০০</span>
<<<<<<< HEAD
                    <span className="text-green-600 font-bold text-sm animate-pulse-slow">৳ ২,০০০</span>
=======
                    <span className={`font-bold text-sm ${hasExpired ? 'text-blue-600' : 'text-green-600'}`}>
                      {hasExpired ? '৳ ২,২০০' : '৳ ২,০০০'}
                    </span>
>>>>>>> 1f8092dc2fb7b1b2fa1c001e680496553551d87b
                  </div>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-all duration-300 hover:scale-[1.02]">
                  <span className="text-gray-700 text-sm">এইচএসসি ভর্তি</span>
                  <div className="flex gap-1">
                    <span className="text-gray-500 line-through text-xs">৳ ৫,০০০</span>
<<<<<<< HEAD
                    <span className="text-green-600 font-bold text-sm animate-pulse-slow">৳ ২,৫০০</span>
=======
                    <span className={`font-bold text-sm ${hasExpired ? 'text-blue-600' : 'text-green-600'}`}>
                      {hasExpired ? '৳ ২,৭৫০' : '৳ ২,৫০০'}
                    </span>
>>>>>>> 1f8092dc2fb7b1b2fa1c001e680496553551d87b
                  </div>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-all duration-300 hover:scale-[1.02]">
                  <span className="text-gray-700 text-sm">বিশ্ববিদ্যালয় ভর্তি</span>
                  <div className="flex gap-1">
                    <span className="text-gray-500 line-through text-xs">৳ ৬,০০০</span>
<<<<<<< HEAD
                    <span className="text-green-600 font-bold text-sm animate-pulse-slow">৳ ৩,০০০</span>
=======
                    <span className={`font-bold text-sm ${hasExpired ? 'text-blue-600' : 'text-green-600'}`}>
                      {hasExpired ? '৳ ৩,২০০' : '৳ ৩,০০০'}
                    </span>
>>>>>>> 1f8092dc2fb7b1b2fa1c001e680496553551d87b
                  </div>
                </div>
              </div>

<<<<<<< HEAD
              {/* Offer Note */}
              <div className="mt-3 p-2 bg-yellow-50 rounded-md border border-yellow-200 animate-pulse-slow">
                <p className="text-xs text-yellow-800 text-center">
                  🎓 প্রথম ১০০ জনের জন্য অতিরিক্ত ১০% ছাড়
=======
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
>>>>>>> 1f8092dc2fb7b1b2fa1c001e680496553551d87b
                </p>
              </div>
            </div>

<<<<<<< HEAD
            {/* Floating Elements with animations */}
            <div className="absolute -top-2 -right-2 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-xs animate-pulse-slow">
              <CountUp end={enrolledCount} duration={2} /> জন এনরোল করেছেন
=======
            {/* Floating Elements - Smaller */}
            <div className={`absolute -top-2 -right-2 text-white px-2 py-1 rounded-full font-bold text-xs ${
              hasExpired ? 'bg-blue-500' : 'bg-red-500'
            }`}>
              {hasExpired ? 'নতুন অফার!' : '৭৫ জন এনরোল করেছেন'}
>>>>>>> 1f8092dc2fb7b1b2fa1c001e680496553551d87b
            </div>
            <div className="absolute -bottom-2 -left-2 bg-green-500 text-white px-3 py-1 rounded-full font-bold text-xs animate-pulse-slow">
              ⭐ ৪.৯/৫
            </div>
          </div>
        </div>

        {/* Bottom Stats with animated counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/20">
          <div className="text-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
            <div className="text-2xl font-bold text-white mb-1">
              <CountUp end={500} duration={3} suffix="+" />
            </div>
            <div className="text-blue-100 text-xs">সক্রিয় কোর্স</div>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
            <div className="text-2xl font-bold text-white mb-1">
              <CountUp end={98} duration={3} suffix="%" />
            </div>
            <div className="text-blue-100 text-xs">সাফল্যের হার</div>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
            <div className="text-2xl font-bold text-white mb-1">
              <CountUp end={50} duration={3} suffix="+" />
            </div>
            <div className="text-blue-100 text-xs">শিক্ষক</div>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
            <div className="text-2xl font-bold text-white mb-1">২৪/৭</div>
            <div className="text-blue-100 text-xs">সাপোর্ট</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OfferBanner
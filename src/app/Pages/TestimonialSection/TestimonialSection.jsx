'use client'
import React, { useState, useEffect } from 'react'
import { Tiro_Bangla } from 'next/font/google'
import { 
  FaStar,
  FaQuoteLeft,
  FaGraduationCap,
  FaUniversity,
  FaSchool,
  FaCheckCircle
} from 'react-icons/fa'

// Load Tiro Bangla font
const tiroBangla = Tiro_Bangla({
  weight: ["400"],
  subsets: ["bengali"],
})

const TestimonialSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const testimonials = [
    {
      id: 1,
      name: "আরাফাত রহমান",
      course: "এসএসসি প্রস্তুতি - বিজ্ঞান",
      institution: "মিরপুর বাংলা উচ্চবিদ্যালয়",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
      text: "মনন একাডেমির মাধ্যমে আমি গণিত ও বিজ্ঞানে অনেক দুর্বলতা কাটিয়ে উঠেছি। শিক্ষকদের সহজ ব্যাখ্যা খুব helpful হয়েছে।",
      result: "জিপিএ ৫.০০"
    },
    {
      id: 2,
      name: "সাবরিনা ইসলাম",
      course: "মেডিকেল ভর্তি প্রস্তুতি",
      institution: "হলি ক্রস কলেজ",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=120&h=120&fit=crop&crop=face",
      text: "বায়োলজি এবং কেমিস্ট্রিতে আমার ভীতি দূর করতে মনন একাডেমি অনেক সাহায্য করেছে। রেকর্ডেড ক্লাসগুলো বারবার দেখে প্র্যাকটিস করার সুযোগ পেয়েছি।",
      result: "ডিএমসিতে ভর্তি"
    }
  ]

  const marqueeCards = [
    {
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        name: 'আরাফাত রহমান',
        handle: '@arafat_rahman',
        date: 'এপ্রিল ২০, ২০২৫',
        text: 'মনন একাডেমির মাধ্যমে আমি গণিত ও বিজ্ঞানে অনেক দুর্বলতা কাটিয়ে উঠেছি। শিক্ষকদের সহজ ব্যাখ্যা খুব helpful হয়েছে।'
    },
    {
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        name: 'সাবরিনা ইসলাম',
        handle: '@sabrina_islam',
        date: 'মে ১০, ২০২৫',
        text: 'বায়োলজি এবং কেমিস্ট্রিতে আমার ভীতি দূর করতে মনন একাডেমি অনেক সাহায্য করেছে। রেকর্ডেড ক্লাসগুলো বারবার দেখে প্র্যাকটিস করার সুযোগ পেয়েছি।'
    },
    {
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        name: 'রিয়াদ হাসান',
        handle: '@riad_hassan',
        date: 'জুন ৫, ২০২৫',
        text: 'ফিজিক্স এবং ম্যাথের জটিল সমস্যা সমাধানে শিক্ষকদের গাইডলাইন অনেক কার্যকরী। মডেল টেস্টগুলো আসল পরীক্ষার জন্য ভালো প্রস্তুতি দিয়েছে।'
    },
    {
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        name: 'তাসনিমা আক্তার',
        handle: '@tasnima_akter',
        date: 'মে ১০, ২০২৫',
        text: 'অ্যাকাউন্টিং এবং ফিন্যান্সে আমার কনসেপ্ট ক্লিয়ার করতে মনন একাডেমির ভূমিকা অসাধারণ। ২৪/৭ সাপোর্ট পাওয়ায় যেকোনো সমস্যায় সাহায্য পেয়েছি।'
    },
  ];

  const CreateCard = ({ card }) => (
    <div className="p-4 rounded-xl mx-3 shadow-lg hover:shadow-xl transition-all duration-300 w-64 sm:w-72 shrink-0 bg-white border border-gray-100 hover:border-blue-200">
      <div className="flex gap-2 items-start">
        <img className="size-8 sm:size-10 rounded-full border-2 border-blue-100" src={card.image} alt="User Image" />
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <p className="font-semibold text-gray-800 text-sm sm:text-base">{card.name}</p>
            <FaCheckCircle className="text-blue-500 text-xs sm:text-sm" />
          </div>
          <span className="text-xs text-slate-500">{card.handle}</span>
        </div>
      </div>
      <p className="text-xs sm:text-sm py-3 text-gray-700 leading-relaxed line-clamp-3">"{card.text}"</p>
      <div className="flex items-center justify-between text-slate-500 text-xs border-t border-gray-100 pt-2">
        <div className="flex items-center gap-1">
          <span>পোস্ট করা</span>
        </div>
        <p className="text-gray-600 font-medium text-xs">{card.date}</p>
      </div>
    </div>
  );

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => 
        prev === testimonials.length - 1 ? 0 : prev + 1
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, testimonials.length])

  const nextTestimonial = () => {
    setCurrentTestimonial(current => 
      current === testimonials.length - 1 ? 0 : current + 1
    )
  }

  const prevTestimonial = () => {
    setCurrentTestimonial(current => 
      current === 0 ? testimonials.length - 1 : current - 1
    )
  }

  const goToTestimonial = (index) => {
    setCurrentTestimonial(index)
  }

  const getInstitutionIcon = (institutionType) => {
    if (institutionType.includes('বিদ্যালয়')) return FaSchool
    if (institutionType.includes('কলেজ')) return FaUniversity
    return FaGraduationCap
  }

  return (
    <div className={`${tiroBangla.className} py-12 px-4 bg-gradient-to-br from-slate-50 to-blue-50/30`}>
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section - Compact */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium mb-3">
            <FaQuoteLeft className="text-blue-500 text-xs" />
            শিক্ষার্থীদের সাফল্যের গল্প
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
            আমাদের <span className="text-blue-600">শিক্ষার্থীরা</span> কি বলেন?
          </h2>
          <p className="text-gray-600 text-sm max-w-xl mx-auto">
            হাজারো শিক্ষার্থীর সাফল্যের গল্প। দেখুন কিভাবে মনন একাডেমি পরিবর্তন এনেছে তাদের শিক্ষা জীবনে।
          </p>
        </div>

        {/* Marquee Section - Compact */}
        <div className="mb-12">
          <style jsx>{`
            @keyframes marqueeScroll {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }

            .marquee-inner {
              animation: marqueeScroll 25s linear infinite;
            }

            .marquee-reverse {
              animation-direction: reverse;
            }

            .marquee-inner:hover {
              animation-play-state: paused;
            }
          `}</style>

          <div className="marquee-row w-full mx-auto  overflow-hidden relative">
            <div className="absolute left-0 top-0 h-full w-12 sm:w-16 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent"></div>
            <div className="marquee-inner flex transform-gpu min-w-[200%] py-4">
              {[...marqueeCards, ...marqueeCards].map((card, index) => (
                <CreateCard key={index} card={card} />
              ))}
            </div>
            <div className="absolute right-0 top-0 h-full w-12 sm:w-16 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent"></div>
          </div>

          <div className="marquee-row w-full mx-auto overflow-hidden relative mt-2">
            <div className="absolute left-0 top-0 h-full w-12 sm:w-16 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent"></div>
            <div className="marquee-inner marquee-reverse flex transform-gpu min-w-[200%] py-4">
              {[...marqueeCards, ...marqueeCards].map((card, index) => (
                <CreateCard key={index} card={card} />
              ))}
            </div>
            <div className="absolute right-0 top-0 h-full w-12 sm:w-16 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestimonialSection
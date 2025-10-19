'use client'
import React from 'react'
import { 
  FaStar, 
  FaUsers, 
  FaClock, 
  FaPlayCircle, 
  FaBook,
  FaCertificate,
  FaChalkboardTeacher,
  FaRegBookmark,
  FaFire
} from 'react-icons/fa'
import Image from 'next/image'
import { Tiro_Bangla } from 'next/font/google'
import Link from 'next/link'

// Load Tiro Bangla font
const tiroBangla = Tiro_Bangla({
  weight: ["400"],
  subsets: ["bengali"],
})

const FeaturedCourses = () => {
  const courses = [
    {
      id: 1,
      title: "এসএসসি পরীক্ষার প্রস্তুতি - গাণিতিক সমস্যা সমাধান",
      instructor: "ড. মোহাম্মদ আলী",
      rating: 4.9,
      students: 3250,
      duration: "৫২ ঘন্টা",
      lectures: 120,
      price: "৳ ২,৯৯৯",
      originalPrice: "৳ ৪,৫০০",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: "এসএসসি প্রস্তুতি",
      badge: "বেস্টসেলার",
      level: "মাধ্যমিক",
      subjects: ["গণিত", "পদার্থবিজ্ঞান", "রসায়ন"],
      features: ["লাইভ ক্লাস", "মডেল টেস্ট", "অনলাইন সাপোর্ট"]
    },
    {
      id: 2,
      title: "এইচএসসি ভর্তি প্রস্তুতি - বিজ্ঞান বিভাগ",
      instructor: "প্রফেসর নুসরাত জাহান",
      rating: 4.8,
      students: 2150,
      duration: "৬৫ ঘন্টা",
      lectures: 150,
      price: "৳ ৩,৫০০",
      originalPrice: "৳ ৫,২০০",
      image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bWF0aHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500",
      category: "কলেজ ভর্তি",
      badge: "পপুলার",
      level: "উচ্চমাধ্যমিক",
      subjects: ["বায়োলজি", "কেমিস্ট্রি", "ফিজিক्स"],
      features: ["এডমিশন টেস্ট", "মক টেস্ট", "গাইডলাইন"]
    },
    {
      id: 3,
      title: "বিশ্ববিদ্যালয় ভর্তি পরীক্ষার প্রস্তুতি",
      instructor: "ড. রফিকুল ইসলাম",
      rating: 4.9,
      students: 4850,
      duration: "৮০ ঘন্টা",
      lectures: 200,
      price: "৳ ৪,৯৯৯",
      originalPrice: "৳ ৭,৮০০",
      image: "https://images.unsplash.com/photo-1628863353691-0071c8c1874c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hlbWlzdHJ5fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",
      category: "বিশ্ববিদ্যালয় ভর্তি",
      badge: "হট",
      level: "ভর্তি প্রস্তুতি",
      subjects: ["গাণিতিক যুক্তি", "ইংরেজি", "সাধারণ জ্ঞান"],
      features: ["কুইজ টেস্ট", "পূর্ববর্তী প্রশ্ন", "এক্সপার্ট গাইডেন্স"]
    },
    {
      id: 4,
      title: "প্রাথমিক শিক্ষা সমাপনী পরীক্ষা প্রস্তুতি",
      instructor: "শামসুন্নাহার বেগম",
      rating: 4.7,
      students: 1800,
      duration: "৩৫ ঘন্টা",
      lectures: 70,
      price: "৳ ১,৫০০",
      originalPrice: "৳ ২,৮০০",
      image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHByaW1hcnklMjBzY2hvb2x8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500",
      category: "পিএসসি প্রস্তুতি",
      badge: "নতুন",
      level: "প্রাথমিক",
      subjects: ["বাংলা", "ইংরেজি", "গণিত"],
      features: ["ইন্টারেক্টিভ ক্লাস", "ফান লার্নিং", "প্যারেন্টস গাইড"]
    },
    {
      id: 5,
      title: "মেডিকেল ভর্তি পরীক্ষা - এমবিবিএস প্রস্তুতি",
      instructor: "ড. সাবরিনা আহমেদ",
      rating: 4.9,
      students: 3200,
      duration: "৯০ ঘন্টা",
      lectures: 220,
      price: "৳ ৫,৯৯৯",
      originalPrice: "৳ ৮,৯০০",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: "মেডিকেল ভর্তি",
      badge: "বিশেষ অফার",
      level: "মেডিকেল",
      subjects: ["বায়োলজি", "কেমিস্ট্রি", "ইংরেজি"],
      features: ["মডেল টেস্ট", "স্পেশাল ক্লাস", "কাউন্সেলিং"]
    },
    {
      id: 6,
      title: "ইঞ্জিনিয়ারিং ভর্তি পরীক্ষা প্রস্তুতি",
      instructor: "প্রফেসর জaved করিম",
      rating: 4.8,
      students: 2750,
      duration: "৭৫ ঘন্টা",
      lectures: 180,
      price: "৳ ৪,৫০০",
      originalPrice: "৳ ৬,৭০০",
      image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: "ইঞ্জিনিয়ারিং ভর্তি",
      badge: "ট্রেন্ডিং",
      level: "ইঞ্জিনিয়ারিং",
      subjects: ["গণিত", "ফিজিক্স", "কেমিস্ট্রি"],
      features: ["প্রবলেম সলভিং", "স্পিড টেস্ট", "এনালিটিক্স"]
    }
  ]

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'বেস্টসেলার':
        return 'bg-orange-500 text-white'
      case 'পপুলার':
        return 'bg-pink-500 text-white'
      case 'হট':
        return 'bg-red-500 text-white'
      case 'নতুন':
        return 'bg-green-500 text-white'
      case 'বিশেষ অফার':
        return 'bg-purple-500 text-white'
      case 'ট্রেন্ডিং':
        return 'bg-blue-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const getLevelColor = (level) => {
    switch (level) {
      case 'প্রাথমিক':
        return 'text-green-600 bg-green-50'
      case 'মাধ্যমিক':
        return 'text-blue-600 bg-blue-50'
      case 'উচ্চমাধ্যমিক':
        return 'text-purple-600 bg-purple-50'
      case 'ভর্তি প্রস্তুতি':
        return 'text-red-600 bg-red-50'
      case 'মেডিকেল':
        return 'text-pink-600 bg-pink-50'
      case 'ইঞ্জিনিয়ারিং':
        return 'text-orange-600 bg-orange-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className={`${tiroBangla.className} min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-12 px-4`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <FaFire className="text-orange-500" />
            শিক্ষার্থীদের জন্য বিশেষ কোর্স
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            একাডেমিক কোর্স
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            স্কুল, কলেজ ও বিশ্ববিদ্যালয় ভর্তি পরীক্ষার জন্য বিশেষায়িত কোর্সসমূহ। 
            অভিজ্ঞ শিক্ষকদের মাধ্যমে গঠিত সিলেবাস অনুসরণ করুন।
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {['সকল কোর্স', 'এসএসসি প্রস্তুতি', 'এইচএসসি ভর্তি', 'বিশ্ববিদ্যালয় ভর্তি', 'মেডিকেল', 'ইঞ্জিনিয়ারিং', 'প্রাথমিক'].map((category) => (
            <button
              key={category}
              className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-blue-500 hover:text-white transition-colors duration-200 font-medium"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {courses.map((course) => (
            <div 
              key={course.id}
              className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Course Image & Badge */}
              <div className="relative">
                <div className="w-full h-48 relative overflow-hidden">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getBadgeColor(course.badge)}`}>
                      {course.badge}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <button className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors">
                      <FaRegBookmark />
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getLevelColor(course.level)}`}>
                      {course.level}
                    </span>
                  </div>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6">
                {/* Category */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-blue-600 font-medium">{course.category}</span>
                  <div className="flex items-center gap-1 text-amber-500">
                    <FaStar className="text-sm" />
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 leading-tight">
                  {course.title}
                </h3>

                {/* Instructor */}
                <div className="flex items-center gap-2 mb-4">
                  <FaChalkboardTeacher className="text-gray-400 text-sm" />
                  <span className="text-sm text-gray-600">শিক্ষক: {course.instructor}</span>
                </div>

                {/* Subjects */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.subjects.map((subject, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
                    >
                      {subject}
                    </span>
                  ))}
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-4 mb-4 text-xs text-gray-500">
                  {course.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <FaCertificate className="text-green-500" />
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <FaUsers className="text-gray-400" />
                    <span>{course.students.toLocaleString()} শিক্ষার্থী</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaClock className="text-gray-400" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaPlayCircle className="text-gray-400" />
                    <span>{course.lectures} লেকচার</span>
                  </div>
                </div>

                {/* Price & Enroll Button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-800">{course.price}</span>
                    <span className="text-sm text-gray-500 line-through">{course.originalPrice}</span>
                  </div>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200">
                    এনরোল করুন
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Link href="/courses">
        <button className="mx-auto block bg-blue-500 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-600 transition-colors duration-200">
          আরও কোর্স দেখুন
        </button>
        </Link>
        
      </div>
    </div>
  )
}

export default FeaturedCourses
'use client'
import React, { useState } from 'react'
import { Tiro_Bangla } from 'next/font/google'
import { 
  FaHeadphones, 
  FaClipboardCheck, 
  FaPlayCircle, 
  FaVideo, 
  FaChalkboardTeacher,
  FaCertificate,
  FaGraduationCap,
  FaUsers,
  FaStar
} from 'react-icons/fa'

// Load Tiro Bangla font
const tiroBangla = Tiro_Bangla({
  weight: ["400"],
  subsets: ["bengali"],
})

const WhyChooseUs = () => {
    const [activeFeature, setActiveFeature] = useState(0);

    const features = [
        {
            icon: FaHeadphones,
            title: "২৪ ঘণ্টা সাপোর্ট",
            description: "যেকোনো সমস্যায় আমরা আছি ২৪/৭। সব সময় পাচ্ছেন বিশেষজ্ঞদের সরাসরি সহায়তা",
            color: "violet"
        },
        {
            icon: FaClipboardCheck,
            title: "এক্সাম সিস্টেম",
            description: "নিয়মিত কুইজ ও পরীক্ষার মাধ্যমে শেখার অগ্রগতি মাপার সুযোগ",
            color: "green"
        },
        {
            icon: FaVideo,
            title: "রেকর্ডেড ক্লাস",
            description: "মিস হওয়া ক্লাস যেকোনো সময় দেখে নিন। বারবার রিভিশন করার সুযোগ",
            color: "orange"
        },
        {
            icon: FaPlayCircle,
            title: "লাইভ ক্লাস",
            description: "সরাসরি শিক্ষকের সাথে ইন্টারেক্টিভ ক্লাসে প্রশ্ন করার সুযোগ",
            color: "blue"
        },
        {
            icon: FaChalkboardTeacher,
            title: "এক্সপার্ট শিক্ষক",
            description: "দেশসেরা অভিজ্ঞ শিক্ষকদের থেকে সরাসরি শিখুন",
            color: "red"
        },
        {
            icon: FaCertificate,
            title: "সার্টিফিকেট ও অগ্রগতি",
            description: "কোর্স শেষে প্রাপ্ত হবে স্বীকৃতিপত্র এবং বিস্তারিত অগ্রগতি রিপোর্ট",
            color: "purple"
        }
    ]

    const getColorClasses = (color, isActive = false) => {
        const baseClasses = "p-6 flex gap-4 rounded-xl transition-all duration-300 cursor-pointer border"
        
        switch (color) {
            case 'violet':
                return `${baseClasses} ${isActive ? 'bg-violet-100 border-violet-300' : 'border-transparent hover:bg-violet-100 hover:border-violet-300'}`
            case 'green':
                return `${baseClasses} ${isActive ? 'bg-green-100 border-green-300' : 'border-transparent hover:bg-green-100 hover:border-green-300'}`
            case 'orange':
                return `${baseClasses} ${isActive ? 'bg-orange-100 border-orange-300' : 'border-transparent hover:bg-orange-100 hover:border-orange-300'}`
            case 'blue':
                return `${baseClasses} ${isActive ? 'bg-blue-100 border-blue-300' : 'border-transparent hover:bg-blue-100 hover:border-blue-300'}`
            case 'red':
                return `${baseClasses} ${isActive ? 'bg-red-100 border-red-300' : 'border-transparent hover:bg-red-100 hover:border-red-300'}`
            case 'purple':
                return `${baseClasses} ${isActive ? 'bg-purple-100 border-purple-300' : 'border-transparent hover:bg-purple-100 hover:border-purple-300'}`
            default:
                return `${baseClasses} ${isActive ? 'bg-gray-100 border-gray-300' : 'border-transparent hover:bg-gray-100 hover:border-gray-300'}`
        }
    }

    const getIconColor = (color) => {
        switch (color) {
            case 'violet': return 'stroke-violet-600'
            case 'green': return 'stroke-green-600'
            case 'orange': return 'stroke-orange-600'
            case 'blue': return 'stroke-blue-600'
            case 'red': return 'stroke-red-600'
            case 'purple': return 'stroke-purple-600'
            default: return 'stroke-gray-600'
        }
    }

    return (
        <div className={`${tiroBangla.className} min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-16 px-4`}>
            <div className="max-w-7xl mx-auto">
                
                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
                        <FaStar className="text-yellow-500" />
                        আমাদের বিশেষ সুবিধাসমূহ
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                        কেন <span className="text-blue-600">আমাদের</span> প্ল্যাটফর্ম বেছে নিবেন?
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        বাংলাদেশের শিক্ষার্থীদের জন্য তৈরি বিশেষায়িত অনলাইন লার্নিং এক্সপেরিয়েন্স। 
                        আধুনিক টেকনোলজি ও অভিজ্ঞ শিক্ষকদের সমন্বয়ে গড়ে উঠেছে আমাদের প্ল্যাটফর্ম।
                    </p>
                </div>

                {/* Main Content Section */}
                <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-10">
                    {/* Image Section */}
                    <div className="flex-1">
                        <img 
                            className="w-full max-w-2xl rounded-3xl shadow-2xl lg:-ml-8 transform hover:scale-105 transition-transform duration-300" 
                            src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/group-image-1.png" 
                            alt="মনন একাডেমির শিক্ষার্থীরা" 
                        />
                    </div>

                    {/* Features Section */}
                    <div className="flex-1 max-w-lg">
                        <div className="">
                            {features.map((feature, index) => (
                                <div 
                                    key={index}
                                    className={getColorClasses(feature.color, activeFeature === index)}
                                    onMouseEnter={() => setActiveFeature(index)}
                                    onMouseLeave={() => setActiveFeature(0)}
                                >
                                    <div className={`p-3 rounded-lg bg-white shadow-sm ${getIconColor(feature.color).replace('stroke', 'text')}`}>
                                        <feature.icon className="text-xl" />
                                    </div>
                                    <div className="space-y-2 flex-1">
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        
                    </div>
                </div>

                {/* CTA Section */}
               
            </div>
        </div>
    )
}

export default WhyChooseUs
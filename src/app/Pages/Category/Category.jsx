import React from 'react';
import { Tiro_Bangla } from "next/font/google";

// Load Tiro Bangla font
const tiroBangla = Tiro_Bangla({
  weight: ["400"], // Tiro Bangla supports regular weight
  subsets: ["bengali"],
});
// Mock data representing the categories shown in the image
const categories = [
  { 
    id: 1, 
    title: 'নবম শ্রেণি', 
    titleColor: 'text-blue-600', 
    desc: 'লেকচার ভিডিও, লাইভ ক্লাস, এসাইনমেন্ট', 
    icon: '📚' 
  },
  { 
    id: 2, 
    title: 'দশম শ্রেণি', 
    titleColor: 'text-green-600', 
    desc: 'লেকচার ভিডিও, লাইভ ক্লাস, এসাইনমেন্ট', 
    icon: '🎓' 
  },
  { 
    id: 3, 
    title: 'এসএসসি', 
    titleColor: 'text-purple-600', 
    desc: 'লেকচার ভিডিও, লাইভ ক্লাস, এসাইনমেন্ট', 
    icon: '✏️' 
  },
  { 
    id: 4, 
    title: 'এইচএসসি', 
    titleColor: 'text-red-500', 
    desc: 'লেকচার ভিডিও, লাইভ ক্লাস, এসাইনমেন্ট', 
    icon: '📄' 
  },
  { 
    id: 5, 
    title: 'এডমিশন', 
    titleColor: 'text-red-700', 
    desc: 'লেকচার ভিডিও, লাইভ ক্লাস, এসাইনমেন্ট', 
    icon: '🔥' 
  },
];

/**
 * A reusable card component for displaying a single category.
 */
const CategoryCard = ({ title, titleColor, desc, icon }) => (
  <div className="flex items-center gap-4 p-1.5 py-4  bg-white rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 cursor-pointer w-full h-full">
  
  
  <div className="flex-shrink-0 text-[40px] bg-opacity-70 rounded-full">
    {icon}
  </div>

  {/* 📝 Text Content */}
  <div className="flex flex-col justify-center text-left">
    <h3 className={`text-lg font-bold ${titleColor}`}>
      {title}
    </h3>
    <p className="text-sm text-gray-500 font-medium">
      {desc}
    </p>
  </div>

</div>

);

/**
 * Main component for the Categories Section.
 */
export default function Category() {
  return (
    // Outer container with the light blue background color
    <div className={`${tiroBangla.className} bg-blue-50 py-12 px-4 md:px-8 lg:px-16`}>
      
      {/* Main Heading in Bengali */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl  md:text-5xl font-extrabold text-blue-900 leading-snug tracking-wider">
          আমাদের ক্যাটাগরিগুলো
        </h1>
      </header>

      {/* Cards Grid Container */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-center gap-6">
          {categories.map((category) => (
            <div 
              key={category.id} 
              className="w-full sm:w-[48%] md:w-[48%] lg:w-[30%] xl:w-1/6 min-w-[200px]"
            >
              <CategoryCard {...category} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
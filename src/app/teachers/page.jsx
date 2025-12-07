'use client';

import React from 'react';
import Image from 'next/image';
import { Tiro_Bangla } from 'next/font/google';

import IMG1 from '../../app/assets/teachers/teacher1.png';
import IMG2 from '../../app/assets/teachers/teacher2.png';
import IMG3 from '../../app/assets/teachers/teacher3.png';
import IMG4 from '../../app/assets/teachers/teacher4.png';

// 🆓 Import Bangla font from Google Fonts
const banglaFont = Tiro_Bangla({
  weight: '400',
  subsets: ['bengali'],
});

export default function Teachers() {
  const teachers = [
    {
      src: IMG1,
      name: 'Hasan Al Mamun',
      role: 'পদার্থবিদ্যা শিক্ষক',
      qualification: 'পদার্থবিদ্যা, ঢাকা বিশ্ববিদ্যালয়',
      bio: 'এইচএসসি পদার্থবিদ্যায় ১০ বছরের অভিজ্ঞতা সম্পন্ন শিক্ষক। ধারণা ভিত্তিক ও সমস্যা সমাধানের মাধ্যমে পড়ানোই মূল লক্ষ্য।',
    },
    {
      src: IMG4,
      name: 'Arifur Rahman',
      role: 'রসায়ন শিক্ষক',
      qualification: 'রসায়ন, বাংলাদেশ প্রকৌশল বিশ্ববিদ্যালয় (BUET)',
      bio: 'অর্গানিক ও ইনঅর্গানিক কেমিস্ট্রির বিশেষজ্ঞ। বাস্তবভিত্তিক ও ইন্টারেক্টিভ পদ্ধতিতে পড়ানোয় অভিজ্ঞ।',
    },
    {
      src: IMG3,
      name: 'Rakib Hasan',
      role: 'গণিত শিক্ষক',
      qualification: 'গণিত, ঢাকা বিশ্ববিদ্যালয়',
      bio: 'জটিল গণিতকে সহজভাবে উপস্থাপন করতে পারদর্শী। শক্তিশালী বেসিক গড়ে তুলতে সহায়তা করেন।',
    },
    {
      src: IMG2,
      name: 'Jahid Hasan',
      role: 'ইংরেজি শিক্ষক',
      qualification: 'ইংরেজি সাহিত্য, ঢাকা বিশ্ববিদ্যালয়',
      bio: 'গ্রামার, শব্দভাণ্ডার ও স্পোকেন প্র্যাকটিসে শিক্ষার্থীদের উন্নত করতে প্রতিশ্রুতিবদ্ধ।',
    },
  ];

  const socialIcons = [
    {
      name: 'LinkedIn',
      path: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.882 0H1.167A1.16 1.16 0 0 0 0 1.161V14.84C0 15.459.519 16 1.167 16H14.83a1.16 1.16 0 0 0 1.166-1.161V1.135C16.048.516 15.53 0 14.882 0M4.744 13.6H2.385V5.987h2.36zM3.552 4.929c-.778 0-1.374-.62-1.374-1.368a1.38 1.38 0 0 1 1.374-1.367 1.38 1.38 0 0 1 1.374 1.367c0 .749-.57 1.368-1.374 1.368M11.33 13.6V9.91c0-.878-.026-2.039-1.245-2.039-1.244 0-1.426.98-1.426 1.961V13.6H6.3V5.987h2.307v1.058h.026c.337-.62 1.09-1.239 2.256-1.239 2.411 0 2.852 1.549 2.852 3.665V13.6z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      path: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.095 0H1.905C.855 0 0 .854 0 1.905v12.19C0 15.145.854 16 1.905 16h12.19c1.05 0 1.905-.854 1.905-1.905V1.905C16 .855 15.146 0 14.095 0m-1.521 6.98a2.85 2.85 0 0 1-2.651-1.277v4.395A3.248 3.248 0 1 1 6.674 6.85c.068 0 .134.006.201.01v1.6c-.067-.007-.132-.02-.2-.02a1.658 1.658 0 1 0 0 3.316c.915 0 1.724-.721 1.724-1.637l.016-7.465h1.531a2.85 2.85 0 0 0 2.63 2.547v1.78"
            fill="currentColor"
          />
        </svg>
      ),
    },
  ];

  return (
    

    <section className={`${banglaFont.className} max-w-7xl mx-auto px-4 py-16`}>
      {/* 🌟 Section Heading */}
      <div className="text-center mb-12">
        <h3 className="text-lg font-medium text-blue-600 mb-2">
          আমাদের শিক্ষকবৃন্দ
        </h3>
        <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-gray-800">
          অভিজ্ঞ ও দক্ষ শিক্ষকমণ্ডলী
        </h1>
        <p className="max-w-2xl mx-auto text-gray-500 text-sm">
          আমাদের অভিজ্ঞ ও দক্ষ শিক্ষকরা আপনাকে প্রতিটি বিষয়ে দখল এনে দিতে কাজ করেন—
          বোঝার মাধ্যমে শেখার ওপর জোর দিয়ে, পরীক্ষায় সেরা ফলের নিশ্চয়তা দিতে।
        </p>
      </div>

      {/* 👩‍🏫 Teachers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {teachers.map((teacher, index) => (
          <div
            key={index}
            className="group bg-white border border-gray-200 rounded-2xl p-8 flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:border-blue-600 transition duration-300 hover:bg-blue-600"
          >
            {/* 🖼️ Image */}
            <div className="w-24 h-24 relative mb-4 rounded-full overflow-hidden border-4 border-blue-100 group-hover:border-white">
              <Image
                src={teacher.src}
                alt={teacher.name}
               
                className="object-cover"
              />
            </div>

            {/* 🧑 Info */}
            <h2 className="text-lg font-semibold text-gray-800 group-hover:text-white">
              {teacher.name}
            </h2>
            <p className="text-blue-600 text-sm font-medium mb-1 group-hover:text-blue-200">
              {teacher.role}
            </p>
            <p className="text-gray-500 text-xs mb-2 group-hover:text-blue-100">
              🎓 {teacher.qualification}
            </p>
            <p className="text-gray-500 text-sm group-hover:text-white/80 line-clamp-3">
              {teacher.bio}
            </p>

            {/* 🌐 Social Icons */}
            <div className="flex space-x-4 mt-5 text-gray-500 group-hover:text-white">
              {socialIcons.map((icon, i) => (
                <a key={i} href="#" aria-label={icon.name}>
                  {icon.path}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
    
  );
}

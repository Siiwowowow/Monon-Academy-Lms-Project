'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import Link from 'next/link';
import useAuth from '@/hooks/useAuth';
import { 
  Clock, 
  FileText, 
  Edit3,
  Calendar,
  CheckCircle,
  PlayCircle
} from 'lucide-react';

export default function TeacherExams() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: exams = [], isLoading, isError } = useQuery({
    queryKey: ['teacher-exams', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/exams');
      return res.data.data.filter(exam => exam.teacherEmail === user?.email);
    },
    enabled: !!user?.email
  });

  // Function to get subject color
  const getSubjectColor = (subject) => {
    const colorMap = {
      'বাংলা প্রথম পত্র': 'bg-red-500',
      'বাংলা দ্বিতীয় পত্র': 'bg-red-400',
      'English First Paper': 'bg-blue-500',
      'English Second Paper': 'bg-blue-400',
      'গণিত': 'bg-green-500',
      'বিজ্ঞান': 'bg-teal-500',
      'পদার্থবিজ্ঞান': 'bg-purple-500',
      'রসায়ন': 'bg-indigo-500',
      'জীববিজ্ঞান': 'bg-emerald-500',
      'ইতিহাস ও বিশ্বসভ্যতা': 'bg-amber-500',
      'ভূগোল ও পরিবেশ': 'bg-lime-500',
      'উচ্চতর গণিত': 'bg-cyan-500',
      'ইসলাম ও নৈতিক শিক্ষা': 'bg-violet-500',
      'হিন্দুধর্ম ও নৈতিক শিক্ষা': 'bg-fuchsia-500',
      'বাংলাদেশ ও বিশ্বপরিচয়': 'bg-rose-500'
    };
    return colorMap[subject] || 'bg-gray-500';
  };

  // Function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 bengali">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 bengali">ত্রুটি! পরীক্ষাগুলো লোড করতে সমস্যা হচ্ছে</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Serif+Bengali:wght@400;500;600;700&display=swap');
        .bengali { font-family: 'Noto Serif Bengali', serif; }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Simple Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 bengali mb-2">
            আমার পরীক্ষাগুলো
          </h1>
          <p className="text-gray-600 bengali">
            মোট পরীক্ষা: {exams.length}
          </p>
        </div>

        {/* Exams Grid */}
        {exams.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500 bengali mb-4">কোন পরীক্ষা পাওয়া যায়নি</p>
            <Link
              href="/create-exam"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <span className="bengali">প্রথম পরীক্ষা তৈরি করুন</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <div 
                key={exam._id} 
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden"
              >
                {/* Subject Header */}
                <div className={`${getSubjectColor(exam.subject)} p-4 text-white`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg bengali line-clamp-1">{exam.subject}</h3>
                      <p className="text-sm opacity-90 bengali">{exam.classLevel}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      exam.isPublished 
                        ? 'bg-green-500 text-white' 
                        : 'bg-yellow-500 text-white'
                    }`}>
                      {exam.isPublished ? 'প্রকাশিত' : 'খসড়া'}
                    </span>
                  </div>
                </div>

                {/* Exam Content */}
                <div className="p-5">
                  {/* Exam Title */}
                  <h4 className="text-lg font-bold text-gray-800 mb-3 bengali line-clamp-2">
                    {exam.title}
                  </h4>

                  {/* Exam Description */}
                  {exam.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 bengali">
                      {exam.description}
                    </p>
                  )}

                  {/* Exam Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Clock size={16} className="text-blue-500" />
                        <span className="bengali">সময়</span>
                      </div>
                      <span>{exam.duration} মিনিট</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <FileText size={16} className="text-green-500" />
                        <span className="bengali">নম্বর</span>
                      </div>
                      <span>{exam.totalMarks}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <CheckCircle size={16} className="text-purple-500" />
                        <span className="bengali">প্রশ্ন</span>
                      </div>
                      <span>{exam.questions?.length || 0} টি</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} className="text-orange-500" />
                        <span className="bengali">তারিখ</span>
                      </div>
                      <span className="bengali text-xs">{formatDate(exam.createdAt)}</span>
                    </div>
                  </div>

                  {/* Exam Type */}
                  <div className="mb-4">
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium bengali">
                      {exam.examType}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <Link
                      href={`/dashboard/teacher/exams/${exam._id}`}
                      className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      <Edit3 size={18} />
                      <span className="bengali">সম্পাদনা</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
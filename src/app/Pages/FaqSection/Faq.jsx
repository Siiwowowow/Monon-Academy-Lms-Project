'use client'
import Lottie from 'lottie-react'
import React from 'react'
import faq from '../../../app/assets/faq.json'

export default function Faq() {
    const [openIndex, setOpenIndex] = React.useState(null);

    const faqs = [
        {
            question: "এই ওয়েবসাইটটি কিভাবে ব্যবহার করব?",
            answer: "ওয়েবসাইটটি ব্যবহার করতে প্রথমে রেজিস্ট্রেশন করুন, তারপর আপনার প্রয়োজনীয় সার্ভিস সিলেক্ট করুন এবং নির্দেশিকা অনুসরণ করুন।",
        },
        {
            question: "কোর্স ফি পরিশোধের পদ্ধতি কি?",
            answer: "আপনি বিকাশ, নগদ, রকেট অথবা ব্যাংক ট্রান্সফারের মাধ্যমে কোর্স ফি পরিশোধ করতে পারবেন। অনলাইন পেমেন্ট সম্পূর্ণ সুরক্ষিত।",
        },
        {
            question: "ক্লাস মিস করলে কি করতে হবে?",
            answer: "সকল ক্লাস রেকর্ডেড আকারে উপলব্ধ থাকে। মিস করা ক্লাস আপনি পরে আমাদের ড্যাশবোর্ড থেকে দেখতে পারবেন anytime.",
        },
        {
            question: "সার্টিফিকেট কি প্রদান করা হয়?",
            answer: "হ্যাঁ, কোর্স সফলভাবে সম্পন্ন করলে আপনি একটি ডিজিটাল সার্টিফিকেট পাবেন, যা প্রিন্টও করা যাবে।",
        },
        {
            question: "টেকনিক্যাল সাপোর্ট কিভাবে পাব?",
            answer: "২৪/৭ হেল্পলাইন, লাইভ চ্যাট এবং ইমেইলের মাধ্যমে আমাদের টেকনিক্যাল টিম আপনার সাহায্যে随时 প্রস্তুত।",
        },
        {
            question: "রিফান্ড পলিসি কি?",
            answer: "কোর্স শুরুর ৭ দিনের মধ্যে আপনি সম্পূর্ণ রিফান্ড পেতে পারেন। এরপর নির্দিষ্ট শর্তসাপেক্ষে partial রিফান্ড প্রযোজ্য।",
        },
    ];

    return (
        <div className="py-12 bg-gray-50">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start justify-center gap-8 px-4 md:px-0">
                <div className="w-full md:w-1/2 flex justify-center">
                    <Lottie style={{ width: '100%', maxWidth: '600px' }} animationData={faq} loop={true} />
                </div>

                <div className="w-full md:w-1/2">
                    <p className="text-indigo-600 text-sm font-medium">প্রায়শই জিজ্ঞাসিত প্রশ্ন</p>
                    <h1 className="text-3xl md:text-4xl font-semibold mt-2">আপনার প্রশ্নের উত্তর খুঁজছেন?</h1>
                    <p className="text-sm text-slate-500 mt-2 pb-4">
                        আপনার প্রশ্নের উত্তর খুঁজে পান। না পেলে সরাসরি আমাদের সাথে যোগাযোগ করুন।
                    </p>

                    {faqs.map((faq, index) => (
                        <div
                            className="border-b border-slate-200 py-4 cursor-pointer"
                            key={index}
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-medium">{faq.question}</h3>
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 18 18"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`${openIndex === index ? 'rotate-180' : ''} transition-all duration-500 ease-in-out`}
                                >
                                    <path
                                        d="m4.5 7.2 3.793 3.793a1 1 0 0 0 1.414 0L13.5 7.2"
                                        stroke="#1D293D"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                            <p
                                className={`text-sm text-slate-500 transition-all duration-500 ease-in-out max-w-md ${
                                    openIndex === index ? 'opacity-100 max-h-[300px] translate-y-0 pt-4' : 'opacity-0 max-h-0 -translate-y-2'
                                }`}
                            >
                                {faq.answer}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

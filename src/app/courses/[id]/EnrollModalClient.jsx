"use client";

import React, { useState } from "react";
import { CheckCircle, X, CreditCard, Building, Smartphone, Shield, Clock, Zap } from "lucide-react";

export default function EnrollModalClient({ course }) {
  const [open, setOpen] = useState(false);

  const paymentMethods = [
    {
      id: "stripe",
      name: "Stripe Payment",
      description: "Credit/Debit Card",
      icon: CreditCard,
      color: "bg-indigo-500 hover:bg-indigo-600",
      textColor: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      id: "sslcommerz",
      name: "SSLCommerz",
      description: "Local Bangladeshi Payment",
      icon: Building,
      color: "bg-green-500 hover:bg-green-600",
      textColor: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      id: "mobile",
      name: "Mobile Banking",
      description: "bKash, Nagad, Rocket",
      icon: Smartphone,
      color: "bg-blue-500 hover:bg-blue-600",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50"
    }
  ];

  const features = [
    "লাইফটাইম এক্সেস",
    "কোর্স সার্টিফিকেট",
    "সাপোর্ট ফোরাম",
    "প্রোজেক্ট ফাইলস",
    "কুইজ ও এসাইনমেন্ট",
    "মোবাইল অ্যাক্সেস"
  ];

  const handlePayment = (method) => {
    console.log(`Processing ${method} payment for:`, course);
    // Add your payment integration logic here
    setOpen(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold text-base transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group"
      >
        এনরোল করুন
        <CheckCircle className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
      </button>

      {/* Modal Overlay */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4 animate-in fade-in-50">
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-6 border-b border-gray-100">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  কোর্সে এনরোল করুন
                </h2>
                <p className="text-gray-600 text-sm">
                  নিরাপদ পেমেন্ট গেটওয়ে
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Course Info */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start space-x-4">
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className="w-16 h-16 rounded-lg object-cover border shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-1">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {course.instructor_name}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">
                      ৳ {course.price}
                    </span>
                    <div className="flex items-center text-green-600 text-sm">
                      <Shield className="w-4 h-4 mr-1" />
                      সুরক্ষিত
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="p-6 border-b border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                আপনি যা পাচ্ছেন:
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="p-6">
              <h4 className="font-semibold text-gray-900 mb-4 text-center">
                পেমেন্ট মেথড নির্বাচন করুন
              </h4>
              
              <div className="space-y-3 mb-6">
                {paymentMethods.map((method) => {
                  const IconComponent = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => handlePayment(method.name)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 hover:border-${method.textColor.split('-')[1]}-500 transition-all duration-200 hover:shadow-md group`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${method.bgColor} group-hover:${method.color} transition-colors duration-200`}>
                          <IconComponent className={`w-5 h-5 ${method.textColor} group-hover:text-white`} />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-gray-900 text-sm">
                            {method.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {method.description}
                          </p>
                        </div>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-transparent group-hover:bg-blue-500 transition-colors duration-200"></div>
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setOpen(false)}
                  className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 hover:border-gray-400"
                >
                  বাতিল
                </button>
                <button
                  onClick={() => handlePayment("default")}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  এনরোল করুন
                </button>
              </div>

              {/* Security Footer */}
              <div className="flex items-center justify-center space-x-2 mt-4 pt-4 border-t border-gray-100">
                <Clock className="w-4 h-4 text-gray-400" />
                <p className="text-xs text-gray-500 text-center">
                  আপনার তথ্য সুরক্ষিত। ২৪/৭ কাস্টমার সাপোর্ট
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
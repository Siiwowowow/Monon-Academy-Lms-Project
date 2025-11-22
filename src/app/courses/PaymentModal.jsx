"use client";

import React, { useState } from "react";
import { X, CreditCard, Shield, Lock, CheckCircle, Loader } from "lucide-react";

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  course, 
  onPaymentMethodSelect,
  processingPayment 
}) => {
  const [selectedMethod, setSelectedMethod] = useState("");

  const paymentMethods = [
    {
      id: "stripe",
      name: "Stripe",
      description: "Pay with Credit/Debit Card",
      icon: CreditCard,
      colors: "from-purple-500 to-blue-600",
      supportedCards: ["Visa", "MasterCard", "American Express"]
    },
    {
      id: "sslcommerz",
      name: "SSLCommerz",
      description: "Bangladeshi Payment Gateway",
      icon: Shield,
      colors: "from-green-500 to-teal-600",
      supportedCards: ["Visa", "MasterCard", "bKash", "Nagad", "Rocket"]
    }
  ];

  if (!isOpen) return null;

  const handleProceed = () => {
    if (!selectedMethod) {
      alert("Please select a payment method");
      return;
    }
    onPaymentMethodSelect(selectedMethod);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">পেমেন্ট অপশন</h2>
            <p className="text-gray-600 text-sm mt-1">
              আপনার পছন্দের পেমেন্ট মেথড নির্বাচন করুন
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Course Summary */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="w-16 h-12 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                {course.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {course.instructor_name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">
                ৳{course.price}
              </p>
              {course.original_price > course.price && (
                <p className="text-sm text-gray-500 line-through">
                  ৳{course.original_price}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            পেমেন্ট মেথড নির্বাচন করুন
          </h3>
          
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                  selectedMethod === method.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${method.colors} rounded-lg flex items-center justify-center`}>
                    <method.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      {method.name}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {method.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {method.supportedCards.map((card, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                        >
                          {card}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedMethod === method.id
                      ? "bg-blue-500 border-blue-500"
                      : "border-gray-300"
                  }`}>
                    {selectedMethod === method.id && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-green-800 text-sm font-medium">
                  নিরাপদ পেমেন্ট
                </p>
                <p className="text-green-700 text-xs mt-1">
                  আপনার সমস্ত ব্যক্তিগত এবং পেমেন্ট তথ্য এনক্রিপ্টেড এবং নিরাপদ
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={processingPayment}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              বাতিল করুন
            </button>
            
            <button
              onClick={handleProceed}
              disabled={!selectedMethod || processingPayment}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processingPayment ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  প্রসেসিং...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  পেমেন্ট করুন
                </>
              )}
            </button>
          </div>
          
          <p className="text-center text-gray-500 text-xs mt-3">
            পেমেন্ট সম্পন্ন হলে আপনি কোর্সে এক্সেস পাবেন
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
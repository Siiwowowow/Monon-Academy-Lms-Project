// app/Payment/success/page.jsx
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, BookOpen, ArrowRight, AlertCircle, Database, RefreshCw, UserCheck } from 'lucide-react';
import Link from 'next/link';

export default function PaymentSuccess() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [course, setCourse] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [roleUpdated, setRoleUpdated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [courseId, setCourseId] = useState('');

  useEffect(() => {
    // Get query parameters from URL
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const session = params.get('session_id');
      const course = params.get('course_id');
      
      if (session && course) {
        setSessionId(session);
        setCourseId(course);
        completeEnrollment(session, course);
        fetchCourseDetails(course);
      } else {
        setError('Missing session ID or course ID');
        setLoading(false);
      }
    }
  }, []);

  const fetchCourseDetails = async (courseId) => {
    try {
      const response = await fetch(`/api/courses/${courseId}`);
      if (response.ok) {
        const courseData = await response.json();
        setCourse(courseData);
      }
    } catch (error) {
      console.error('Error fetching course details:', error);
    }
  };

  const updateUserRoleToStudent = async (email) => {
    if (!email) return false;
    
    try {
      console.log(`Attempting to update role for: ${email}`);
      
      // Check current role
      const roleRes = await fetch(`/api/users/role?email=${email}`);
      if (!roleRes.ok) {
        console.error('Failed to check user role');
        return false;
      }
      
      const roleData = await roleRes.json();
      console.log(`Current role for ${email}:`, roleData.role);
      
      // Only update if role is "user"
      if (roleData.role === "user") {
        // Call the role update API
        const updateRes = await fetch('/api/update-role', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email,
            paymentStatus: "success",
            courseId: courseId,
            sessionId: sessionId,
            action: "auto"
          })
        });
        
        if (updateRes.ok) {
          const updateData = await updateRes.json();
          console.log('Role update response:', updateData);
          return updateData.roleUpdated;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error updating user role:', error);
      return false;
    }
  };

  const completeEnrollment = async (sessionId, courseId) => {
    try {
      console.log('Completing enrollment for course:', courseId, 'Session:', sessionId);
      
      // First, verify if payment already exists
      try {
        const verifyResponse = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId })
        });

        if (verifyResponse.ok) {
          const verifyData = await verifyResponse.json();
          setPaymentData(verifyData.payment);
          
          // Store user email for role update
          if (verifyData.payment.userEmail) {
            setUserEmail(verifyData.payment.userEmail);
            
            // Update role after verification
            const roleUpdatedResult = await updateUserRoleToStudent(verifyData.payment.userEmail);
            setRoleUpdated(roleUpdatedResult);
          }
          
          setEnrollmentSuccess(true);
          console.log('Payment already exists in database:', verifyData.payment);
          setLoading(false);
          return;
        }
      } catch (verifyError) {
        console.log('Verify payment failed, continuing with enrollment...');
      }

      // Create enrollment
      const response = await fetch('/api/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: courseId,
          paymentMethod: 'stripe',
          sessionId: sessionId,
          status: 'success',
          price: course?.price || 0
        })
      });

      const data = await response.json();
      console.log('Enrollment API response:', data);

      if (response.ok) {
        setEnrollmentSuccess(true);
        setPaymentData(data);
        
        // Update role after successful enrollment
        if (data.userEmail) {
          setUserEmail(data.userEmail);
          
          // Check if role was already updated by the enrollment API
          if (data.roleUpdated) {
            setRoleUpdated(true);
          } else {
            // Manually update role
            const roleUpdatedResult = await updateUserRoleToStudent(data.userEmail);
            setRoleUpdated(roleUpdatedResult);
          }
        }
        
        console.log('Enrollment successful:', data);
      } else {
        console.error('Enrollment failed:', data);
        setError(data.error || 'Enrollment failed after payment. Please contact support.');
      }
    } catch (error) {
      console.error('Error completing enrollment:', error);
      setError('Network error during enrollment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (sessionId && courseId) {
      setLoading(true);
      setError(null);
      completeEnrollment(sessionId, courseId);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing Your Enrollment</h2>
          <p className="text-gray-600">Setting up your course access...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Enrollment Issue
          </h1>
          
          <p className="text-gray-600 mb-6">
            {error}
          </p>

          <div className="space-y-3">
            <button 
              onClick={handleRetry}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Retry Enrollment
            </button>
            
            <Link href={`/courses/${courseId}`}>
              <button className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
                <BookOpen className="w-5 h-5" />
                Back to Course
              </button>
            </Link>
          </div>

          <div className="mt-6 p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-sm">
              <strong>Session ID:</strong> {sessionId}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-gray-600 text-lg mb-2">
            Thank you for your purchase
          </p>

          {course && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-4">
                <img
                  src={course.thumbnail_url || "/api/placeholder/60/40"}
                  alt={course.title}
                  className="w-16 h-12 object-cover rounded-lg"
                />
                <div className="text-left flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm">{course.title}</h3>
                  <p className="text-gray-600 text-xs">{course.instructor_name}</p>
                  <p className="text-green-600 font-bold text-sm">৳{course.price}</p>
                </div>
              </div>
            </div>
          )}

          {/* Role Update Status */}
          {roleUpdated && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center gap-2 text-blue-600 mb-2">
                <UserCheck className="w-5 h-5" />
                <span className="font-medium text-lg">🎉 Welcome Student!</span>
              </div>
              <p className="text-blue-700 text-sm">
                Your account has been upgraded to <strong>Student</strong> status.
                You now have access to all student features!
              </p>
            </div>
          )}

          {/* Payment Details */}
          {paymentData && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
                <Database className="w-4 h-4" />
                <span className="font-medium">Payment Successfully Processed</span>
              </div>
              <div className="text-left text-sm text-green-700 space-y-1">
                <p><strong>Payment ID:</strong> {paymentData.paymentId || paymentData.id}</p>
                <p><strong>Transaction ID:</strong> {paymentData.transactionId}</p>
                <p><strong>User Email:</strong> {paymentData.userEmail}</p>
                <p><strong>User Role:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${roleUpdated ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                    {roleUpdated ? 'Student' : (paymentData.userRole || 'User')}
                  </span>
                </p>
                <p><strong>Status:</strong> {paymentData.status || 'completed'}</p>
                <p><strong>Method:</strong> {paymentData.paymentMethod || 'stripe'}</p>
              </div>
            </div>
          )}

          {enrollmentSuccess && (
            <div className="mb-6">
              <p className="text-green-600 font-medium text-lg mb-4">
                🎉 You now have full access to the course!
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 text-sm">
                  You can start learning immediately. All course materials are now available.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {enrollmentSuccess && courseId ? (
              <Link href={`/courses/${courseId}/learn`} className="flex-1">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Start Learning
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            ) : null}
            
            <Link href="/courses" className="flex-1">
              <button className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-6 rounded-lg transition-colors">
                Browse Courses
              </button>
            </Link>
          </div>

          {/* Support Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>Payment Reference:</strong> {sessionId}
            </p>
            <p className="text-blue-800 text-sm mt-1">
              <strong>Course ID:</strong> {courseId}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
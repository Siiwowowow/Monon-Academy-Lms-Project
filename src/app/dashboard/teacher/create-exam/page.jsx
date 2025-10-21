// app/create-exam/page.js
'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  BookOpen, 
  FileText, 
  Image as ImageIcon, 
  CheckCircle, 
  Save,
  Settings,
  Clock,
  Users,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Copy,
} from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import useAxiosSecure from '@/hooks/useAxiosSecure';

// --- Subject and Class Configuration ---
const SUBJECTS = [
  'বাংলা প্রথম পত্র',
  'বাংলা দ্বিতীয় পত্র', 
  'English First Paper',
  'English Second Paper',
  'গণিত',
  'বিজ্ঞান',
  'ইতিহাস ও বিশ্বসভ্যতা',
  'ভূগোল ও পরিবেশ',
  'পদার্থবিজ্ঞান',
  'রসায়ন',
  'জীববিজ্ঞান',
  'উচ্চতর গণিত',
  'ইসলাম ও নৈতিক শিক্ষা',
  'হিন্দুধর্ম ও নৈতিক শিক্ষা',
  'বাংলাদেশ ও বিশ্বপরিচয়'
];

const CLASS_LEVELS = [
  'ষষ্ঠ শ্রেণী',
  'সপ্তম শ্রেণী', 
  'অষ্টম শ্রেণী',
  'নবম শ্রেণী',
  'দশম শ্রেণী',
  'একাদশ শ্রেণী',
  'দ্বাদশ শ্রেণী'
];

const EXAM_TYPES = [
  'অর্ধবার্ষিক পরীক্ষা',
  'বার্ষিক পরীক্ষা',
  'প্রাক-নির্বাচনী পরীক্ষা',
  'নির্বাচনী পরীক্ষা',
  'মডেল টেস্ট',
  'ক্লাস টেস্ট',
  'অ্যাসাইনমেন্ট'
];

// --- Enhanced Option Input Component ---
const OptionInput = ({ option, index, onChange, isCorrect, onToggleCorrect, onRemove }) => (
  <div className="flex items-center space-x-2 my-2 bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
    <button
      type="button"
      onClick={() => onToggleCorrect(index)}
      className={`p-2 rounded-full transition-all duration-200 ${
        isCorrect 
          ? 'bg-green-500 text-white shadow-lg scale-110' 
          : 'bg-gray-100 text-gray-400 border border-gray-300 hover:bg-green-50 hover:text-green-500'
      }`}
      title={isCorrect ? "Correct Answer" : "Mark as Correct"}
    >
      <CheckCircle size={18} />
    </button>
    
    <span className="font-bold w-6 text-center text-gray-700 bengali">
      {['ক', 'খ', 'গ', 'ঘ'][index]}
    </span>
    
    <input
      type="text"
      value={option.text}
      onChange={(e) => onChange(index, 'text', e.target.value)}
      placeholder={`Option ${index + 1} text`}
      className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
      required
    />
    
    {index >= 2 && (
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
        title="Remove Option"
      >
        <Trash2 size={16} />
      </button>
    )}
  </div>
);

// --- Enhanced MCQ Form Component ---
const MCQForm = ({ question, index, updateQuestion, removeQuestion }) => {
  const [expanded, setExpanded] = useState(true);

  const handleUpdate = useCallback((field, value) => {
    updateQuestion(index, { ...question, [field]: value });
  }, [index, question, updateQuestion]);

  const handleOptionChange = useCallback((optIndex, field, value) => {
    const newOptions = question.options.map((opt, i) =>
      i === optIndex ? { ...opt, [field]: value } : opt
    );
    handleUpdate('options', newOptions);
  }, [question.options, handleUpdate]);

  const handleToggleCorrect = useCallback((optIndex) => {
    handleUpdate('correctAnswerIndex', optIndex);
  }, [handleUpdate]);

  const addOption = useCallback(() => {
    if (question.options.length < 6) {
      const newOptions = [...question.options, { text: `Option ${question.options.length + 1}` }];
      handleUpdate('options', newOptions);
    }
  }, [question.options, handleUpdate]);

  const removeOption = useCallback((optIndex) => {
    if (question.options.length > 2) {
      const newOptions = question.options.filter((_, i) => i !== optIndex);
      const newCorrectIndex = question.correctAnswerIndex >= optIndex 
        ? Math.max(0, question.correctAnswerIndex - 1)
        : question.correctAnswerIndex;
      
      handleUpdate('options', newOptions);
      handleUpdate('correctAnswerIndex', newCorrectIndex);
    }
  }, [question.options, question.correctAnswerIndex, handleUpdate]);

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleUpdate('imageUrl', reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, [handleUpdate]);

  const handleRemoveImage = useCallback(() => {
    handleUpdate('imageUrl', '');
  }, [handleUpdate]);

  const duplicateQuestion = useCallback(() => {
    const duplicated = JSON.parse(JSON.stringify(question));
    duplicated.id = Date.now();
    updateQuestion(index, duplicated, true);
  }, [question, index, updateQuestion]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-teal-500 my-4 hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 pb-3 border-b">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
          >
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
            <h3 className="text-lg font-semibold text-teal-700 bengali">
              বহুনির্বাচনি প্রশ্ন {index + 1}
            </h3>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium bg-teal-100 text-teal-800 px-2 py-1 rounded-full">
            {question.mark} Mark{question.mark !== 1 ? 's' : ''}
          </span>
          
          <button
            onClick={duplicateQuestion}
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
            title="Duplicate Question"
          >
            <Copy size={18} />
          </button>
          
          <button
            onClick={() => removeQuestion(index)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="Remove Question"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="space-y-4">
          {/* Question Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 bengali">
              প্রশ্নের বিবরণ
            </label>
            <textarea
              value={question.text}
              onChange={(e) => handleUpdate('text', e.target.value)}
              placeholder="প্রশ্নটি এখানে লিখুন..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
              rows="3"
              required
            />
          </div>

          {/* Marks and Image Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marks
              </label>
              <input
                type="number"
                value={question.mark}
                onChange={(e) => handleUpdate('mark', parseInt(e.target.value) || 1)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                min="1"
                max="10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <ImageIcon size={16} className="mr-2" />
                ছবি যোগ করুন
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 transition-colors"
              />
            </div>
          </div>

          {/* Image Preview */}
          {question.imageUrl && (
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg relative bg-gray-50">
              <img
                src={question.imageUrl}
                alt="Question illustration"
                className="max-h-48 mx-auto object-contain rounded"
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">Image Preview</p>
                <button
                  onClick={handleRemoveImage}
                  className="flex items-center space-x-1 px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={14} />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          )}

          {/* Options Section */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-medium text-gray-700 bengali">
                অপশনসমূহ
              </label>
              {question.options.length < 6 && (
                <button
                  type="button"
                  onClick={addOption}
                  className="flex items-center space-x-1 px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Plus size={14} />
                  <span>Add Option</span>
                </button>
              )}
            </div>

            <div className="space-y-2">
              {question.options.map((opt, optIndex) => (
                <OptionInput
                  key={optIndex}
                  option={opt}
                  index={optIndex}
                  onChange={handleOptionChange}
                  isCorrect={question.correctAnswerIndex === optIndex}
                  onToggleCorrect={handleToggleCorrect}
                  onRemove={removeOption}
                />
              ))}
            </div>

            {question.correctAnswerIndex !== null && (
              <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700 flex items-center">
                  <CheckCircle size={16} className="mr-2" />
                  Correct answer: <span className="font-bold bengali ml-1">
                    {['ক', 'খ', 'গ', 'ঘ'][question.correctAnswerIndex]}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Enhanced Srijonshil Form Component ---
const SrijonshilForm = ({ question, index, updateQuestion, removeQuestion }) => {
  const [expanded, setExpanded] = useState(true);

  const handleUpdate = useCallback((field, value) => {
    updateQuestion(index, { ...question, [field]: value });
  }, [index, question, updateQuestion]);

  const handleSubQUpdate = useCallback((subIndex, field, value) => {
    const newSubQuestions = question.subQuestions.map((subQ, i) =>
      i === subIndex ? { ...subQ, [field]: value } : subQ
    );
    handleUpdate('subQuestions', newSubQuestions);
  }, [question.subQuestions, handleUpdate]);

  const subQuestionLabels = [
    { label: 'ক', title: 'জ্ঞানমূলক', mark: 1 },
    { label: 'খ', title: 'অনুধাবনমূলক', mark: 2 },
    { label: 'গ', title: 'প্রয়োগমূলক', mark: 3 },
    { label: 'ঘ', title: 'উচ্চতর দক্ষতামূলক', mark: 4 },
  ];

  const duplicateQuestion = useCallback(() => {
    const duplicated = JSON.parse(JSON.stringify(question));
    duplicated.id = Date.now();
    updateQuestion(index, duplicated, true);
  }, [question, index, updateQuestion]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500 my-4 hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 pb-3 border-b">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
          >
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
            <h3 className="text-lg font-semibold text-indigo-700 bengali">
              সৃজনশীল প্রশ্ন {index + 1}
            </h3>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
            {question.mark} Marks
          </span>
          
          <button
            onClick={duplicateQuestion}
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
            title="Duplicate Question"
          >
            <Copy size={18} />
          </button>
          
          <button
            onClick={() => removeQuestion(index)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="Remove Question"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="space-y-4">
          {/* Uddipak/Stimulus */}
          <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-400">
            <label className="block text-sm font-bold text-indigo-700 mb-2 bengali">
              উদ্দীপক (Stimulus/Context)
            </label>
            <textarea
              value={question.uddipak}
              onChange={(e) => handleUpdate('uddipak', e.target.value)}
              placeholder="উদ্দীপক বা প্রসঙ্গটি এখানে লিখুন..."
              className="w-full p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-colors"
              rows="4"
              required
            />
          </div>

          {/* Sub-Questions */}
          <div className="space-y-4">
            <label className="block text-base font-bold text-gray-700 mb-2 bengali">
              উপ-প্রশ্নসমূহ
            </label>
            
            {question.subQuestions.map((subQ, subIndex) => (
              <div key={subIndex} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center justify-center w-8 h-8 bg-indigo-500 text-white rounded-full text-sm font-bold bengali">
                      {subQuestionLabels[subIndex].label}
                    </span>
                    <div>
                      <h4 className="font-semibold text-gray-800 bengali">
                        {subQuestionLabels[subIndex].title}
                      </h4>
                      <p className="text-xs text-gray-500">
                        Cognitive Level
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {subQuestionLabels[subIndex].mark} Mark{subQuestionLabels[subIndex].mark !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <textarea
                  value={subQ.text}
                  onChange={(e) => handleSubQUpdate(subIndex, 'text', e.target.value)}
                  placeholder={`প্রশ্ন ${subQuestionLabels[subIndex].label} লিখুন...`}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors"
                  rows="2"
                  required
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main Enhanced Application Component ---
const Create_Exam = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  
  const [examTitle, setExamTitle] = useState('এসএসসি প্রস্তুতিমূলক পরীক্ষা - ২০২৪');
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [classLevel, setClassLevel] = useState(CLASS_LEVELS[3]); // 9th grade
  const [examType, setExamType] = useState(EXAM_TYPES[4]); // Model Test
  const [duration, setDuration] = useState(180); // 3 hours in minutes
  const [instructions, setInstructions] = useState('');
  const [questions, setQuestions] = useState([]);
  const [saveStatus, setSaveStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const createMCQ = useCallback(() => ({
    id: Date.now(),
    type: 'mcq',
    text: '',
    mark: 1,
    imageUrl: '',
    options: [
      { text: 'প্রথম অপশন' },
      { text: 'দ্বিতীয় অপশন' },
      { text: 'তৃতীয় অপশন' },
      { text: 'চতুর্থ অপশন' },
    ],
    correctAnswerIndex: 0,
  }), []);

  const createSrijonshil = useCallback(() => ({
    id: Date.now(),
    type: 'srijonshil',
    uddipak: '',
    mark: 10,
    subQuestions: [
      { id: 'k', text: '', mark: 1 },
      { id: 'kh', text: '', mark: 2 },
      { id: 'g', text: '', mark: 3 },
      { id: 'gh', text: '', mark: 4 },
    ],
  }), []);

  const addQuestion = useCallback((type) => {
    setQuestions(prev => [
      ...prev,
      type === 'mcq' ? createMCQ() : createSrijonshil()
    ]);
  }, [createMCQ, createSrijonshil]);

  const removeQuestion = useCallback((index) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateQuestion = useCallback((index, newQuestion, isDuplicate = false) => {
    if (isDuplicate) {
      // Insert duplicate after the original
      setQuestions(prev => {
        const newQuestions = [...prev];
        newQuestions.splice(index + 1, 0, newQuestion);
        return newQuestions;
      });
    } else {
      setQuestions(prev => prev.map((q, i) => i === index ? newQuestion : q));
    }
  }, []);

  // --- API Integration for Creating Exam ---
  const handleCreateExam = async () => {
    if (!user) {
      alert('দয়া করে লগইন করুন');
      return;
    }

    if (questions.length === 0) {
      alert('দয়া করে কমপক্ষে একটি প্রশ্ন যোগ করুন');
      return;
    }

    setLoading(true);
    setSaveStatus('সংরক্ষণ করা হচ্ছে...');

    try {
      // Transform questions data for MongoDB
      const transformedQuestions = questions.map(q => {
        if (q.type === 'mcq') {
          return {
            questionText: q.text,
            questionType: 'multiple-choice',
            options: q.options.map((opt, idx) => ({
              text: opt.text,
              isCorrect: idx === q.correctAnswerIndex
            })),
            points: q.mark,
            explanation: '',
            imageUrl: q.imageUrl || ''
          };
        } else if (q.type === 'srijonshil') {
          return {
            questionText: q.uddipak,
            questionType: 'creative',
            subQuestions: q.subQuestions.map(subQ => ({
              label: subQ.id,
              text: subQ.text,
              points: subQ.mark
            })),
            points: q.mark,
            explanation: ''
          };
        }
        return q;
      });

      const examData = {
        title: examTitle,
        description: `${subject} - ${examType}`,
        subject: subject,
        educationBoard: 'Dhaka', // You can make this dynamic
        classLevel: classLevel,
        duration: duration,
        totalMarks: totalMarks,
        passingMarks: Math.ceil(totalMarks * 0.33), // 33% passing
        instructions: instructions,
        questions: transformedQuestions,
        teacherId: user.uid,
        teacherName: user.displayName || 'Unknown Teacher',
        teacherEmail: user.email,
        examType: examType,
        tags: [subject, classLevel, examType],
        isPublished: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('Sending exam data:', examData);

      const response = await axiosSecure.post('/api/exams', examData);
      
      if (response.data.success) {
        setSaveStatus('পরীক্ষা সফলভাবে তৈরি হয়েছে!');
        
        // Reset form after successful creation
        setTimeout(() => {
          setExamTitle('এসএসসি প্রস্তুতিমূলক পরীক্ষা - ২০২৪');
          setSubject(SUBJECTS[0]);
          setClassLevel(CLASS_LEVELS[3]);
          setExamType(EXAM_TYPES[4]);
          setDuration(180);
          setInstructions('');
          setQuestions([]);
          setSaveStatus('');
        }, 2000);
      } else {
        throw new Error(response.data.error || 'Failed to create exam');
      }
    } catch (error) {
      console.error('Error creating exam:', error);
      setSaveStatus('ত্রুটি: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const totalMarks = questions.reduce((acc, q) => {
    if (q.type === 'mcq') {
      return acc + q.mark;
    } else if (q.type === 'srijonshil') {
      return acc + q.subQuestions.reduce((subAcc, subQ) => subAcc + subQ.mark, 0);
    }
    return acc;
  }, 0);

  const mcqCount = questions.filter(q => q.type === 'mcq').length;
  const srijonshilCount = questions.filter(q => q.type === 'srijonshil').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 font-sans">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Serif+Bengali:wght@400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .bengali { font-family: 'Noto Serif Bengali', serif; }
      `}</style>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8 pt-6">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-white rounded-2xl shadow-lg">
              <BookOpen className="text-blue-600" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-gray-800 bengali">
                প্রশ্নপত্র তৈরি
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Advanced Exam Creator for Bangladeshi Curriculum
              </p>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4 text-xs">
            <div className="flex items-center space-x-1 bg-white px-3 py-1 rounded-full shadow">
              <Users size={12} />
              <span>User: {user?.email || 'Loading...'}</span>
            </div>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Exam Configuration Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-blue-500">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Settings size={20} className="mr-2" />
                পরীক্ষার তথ্য
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 bengali">শিরোনাম</label>
                  <input
                    type="text"
                    value={examTitle}
                    onChange={(e) => setExamTitle(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bengali text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 bengali">বিষয়</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bengali text-sm"
                  >
                    {SUBJECTS.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 bengali">শ্রেণী</label>
                    <select
                      value={classLevel}
                      onChange={(e) => setClassLevel(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bengali text-sm"
                    >
                      {CLASS_LEVELS.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 bengali">ধরন</label>
                    <select
                      value={examType}
                      onChange={(e) => setExamType(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bengali text-sm"
                    >
                      {EXAM_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Clock size={14} className="mr-1" />
                    সময় (মিনিট)
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    max="360"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 bengali">নির্দেশাবলী</label>
                  <textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="পরীক্ষার নির্দেশাবলী লিখুন..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    rows="3"
                  />
                </div>
              </div>
            </div>

            {/* Statistics Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-green-500">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Bookmark size={20} className="mr-2" />
                পরিসংখ্যান
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600 bengali">মোট প্রশ্ন</span>
                  <span className="text-lg font-bold text-blue-600">{questions.length}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600 bengali">MCQ প্রশ্ন</span>
                  <span className="text-lg font-bold text-teal-600">{mcqCount}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600 bengali">সৃজনশীল প্রশ্ন</span>
                  <span className="text-lg font-bold text-indigo-600">{srijonshilCount}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600 bengali">মোট নম্বর</span>
                  <span className="text-lg font-bold text-green-600">{totalMarks}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Action Bar */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div className="flex space-x-3">
                  <button
                    onClick={() => addQuestion('mcq')}
                    className="flex items-center space-x-2 px-4 py-3 bg-teal-500 text-white font-semibold rounded-xl shadow-lg hover:bg-teal-600 transition-all duration-200 hover:scale-105"
                  >
                    <Plus size={18} />
                    <span className="bengali">MCQ যোগ করুন</span>
                  </button>
                  <button
                    onClick={() => addQuestion('srijonshil')}
                    className="flex items-center space-x-2 px-4 py-3 bg-indigo-500 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-600 transition-all duration-200 hover:scale-105"
                  >
                    <FileText size={18} />
                    <span className="bengali">সৃজনশীল যোগ করুন</span>
                  </button>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleCreateExam}
                    disabled={loading || questions.length === 0}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all duration-200 ${
                      questions.length > 0 && !loading
                        ? 'bg-blue-600 text-white shadow-xl hover:bg-blue-700 hover:scale-105' 
                        : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    <Save size={18} />
                    <span className="bengali">
                      {loading ? 'সংরক্ষণ করা হচ্ছে...' : 'পরীক্ষা তৈরি করুন'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Questions List */}
            <section>
              {questions.length === 0 ? (
                <div className="text-center p-12 bg-white rounded-2xl shadow-inner border-2 border-dashed border-gray-300">
                  <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-500 mb-2 bengali">কোন প্রশ্ন যোগ করা হয়নি</h3>
                  <p className="text-gray-400 bengali">উপরে বোতাম ব্যবহার করে প্রথম প্রশ্নটি যোগ করুন</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.map((q, index) => {
                    if (q.type === 'mcq') {
                      return (
                        <MCQForm
                          key={q.id}
                          question={q}
                          index={index}
                          updateQuestion={updateQuestion}
                          removeQuestion={removeQuestion}
                        />
                      );
                    } else if (q.type === 'srijonshil') {
                      return (
                        <SrijonshilForm
                          key={q.id}
                          question={q}
                          index={index}
                          updateQuestion={updateQuestion}
                          removeQuestion={removeQuestion}
                        />
                      );
                    }
                    return null;
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      {/* Save Status */}
      {saveStatus && (
        <div className={`fixed bottom-6 right-6 p-4 rounded-2xl shadow-2xl text-white font-semibold transition-all duration-300 ${
          saveStatus.includes('সফলভাবে') ? 'bg-green-500' : saveStatus.includes('ত্রুটি') ? 'bg-red-500' : 'bg-blue-500'
        }`}>
          <div className="flex items-center space-x-2">
            {saveStatus.includes('সফলভাবে') ? (
              <CheckCircle size={20} />
            ) : (
              <div className={`w-3 h-3 rounded-full animate-pulse ${saveStatus.includes('ত্রুটি') ? 'bg-red-200' : 'bg-blue-200'}`}></div>
            )}
            <span>{saveStatus}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Create_Exam;
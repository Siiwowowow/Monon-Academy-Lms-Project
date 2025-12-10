// utils/assistantUtils.js
export const WEBSITE_MAP = {
    // Core pages
    home: { path: '/', description: 'Home Page', keywords: ['home', 'main', 'start', 'landing'] },
    courses: { path: '/courses', description: 'Courses Page', keywords: ['courses', 'classes', 'learn', 'study'] },
    teachers: { path: '/teachers', description: 'Teachers Page', keywords: ['teachers', 'instructors', 'faculty'] },
    login: { path: '/login', description: 'Login Page', keywords: ['login', 'signin', 'auth'] },
    signup: { path: '/signUp', description: 'Sign Up Page', keywords: ['signup', 'register', 'create account'] },
    dashboard: { path: '/dashboard', description: 'Dashboard', keywords: ['dashboard', 'panel', 'control'] },
    video: { path: '/video', description: 'Video Player', keywords: ['video', 'watch', 'player'] },
    community: { path: '/community', description: 'Community', keywords: ['community', 'discuss', 'forum'] },
    contact: { path: '/contact', description: 'Contact', keywords: ['contact', 'support', 'help'] },
    
    // Dashboard sub-pages
    admin: { path: '/dashboard/admin/overview', description: 'Admin Dashboard', keywords: ['admin', 'manage'] },
    'admin users': { path: '/dashboard/admin/users', description: 'User Management', keywords: ['users', 'manage users'] },
    'admin courses': { path: '/dashboard/admin/courses', description: 'Course Management', keywords: ['manage courses'] },
    
    teacher: { path: '/dashboard/teacher/overview', description: 'Teacher Dashboard', keywords: ['teacher portal'] },
    'create course': { path: '/dashboard/teacher/createCourse', description: 'Create Course', keywords: ['create course', 'new course'] },
    'create exam': { path: '/dashboard/teacher/create-exam', description: 'Create Exam', keywords: ['create exam', 'make test'] },
    'my courses': { path: '/dashboard/teacher/myCourses', description: 'My Courses', keywords: ['my courses', 'teacher courses'] },
    
    student: { path: '/dashboard/student/overview', description: 'Student Dashboard', keywords: ['student portal'] },
    'student courses': { path: '/dashboard/student/my-courses', description: 'My Courses', keywords: ['my courses', 'enrolled'] },
    assignments: { path: '/dashboard/student/assignments', description: 'Assignments', keywords: ['assignments', 'homework'] },
    grades: { path: '/dashboard/student/grades', description: 'Grades', keywords: ['grades', 'marks', 'results'] }
  };
  
  export const FEATURE_INFO = {
    payment: {
      title: 'Payment System',
      description: 'Monon Academy uses Stripe for secure payments. Courses may require payment before enrollment.',
      steps: ['Go to course page', 'Click "Enroll Now"', 'Complete payment', 'Access course content']
    },
    enrollment: {
      title: 'Enrollment Process',
      description: 'To enroll in a course, you need to either have free access or complete payment.',
      steps: ['Browse courses', 'Select a course', 'Check requirements', 'Enroll/Pay', 'Start learning']
    },
    exams: {
      title: 'Exam System',
      description: 'Teachers can create exams with multiple question types. Students take exams after completing lessons.',
      steps: ['Complete lessons', 'Take exam', 'Submit answers', 'View results']
    },
    videos: {
      title: 'Video Learning',
      description: 'Video lessons are available for enrolled courses. Some may be free previews.',
      steps: ['Enroll in course', 'Navigate to video section', 'Select lesson', 'Watch and learn']
    }
  };
  
  export const analyzeQuery = (query, userRole) => {
    const lowerQuery = query.toLowerCase().trim();
    
    // Check for navigation intent
    for (const [key, page] of Object.entries(WEBSITE_MAP)) {
      if (page.keywords.some(keyword => lowerQuery.includes(keyword))) {
        return {
          action: 'navigate',
          data: page,
          response: `I'll take you to the ${page.description}.`
        };
      }
    }
    
    // Check for feature information
    for (const [feature, info] of Object.entries(FEATURE_INFO)) {
      if (lowerQuery.includes(feature)) {
        return {
          action: 'info',
          data: { feature, info },
          response: `Here's information about ${info.title}.`
        };
      }
    }
    
    // Check for help requests
    const helpKeywords = ['help', 'problem', 'issue', 'not working', 'error', 'trouble'];
    if (helpKeywords.some(keyword => lowerQuery.includes(keyword))) {
      return {
        action: 'help',
        data: { query: lowerQuery },
        response: 'Let me help you with that issue.'
      };
    }
    
    // Default to OpenAI for complex queries
    return {
      action: 'openai',
      data: { query: lowerQuery },
      response: 'Processing your query with AI...'
    };
  };
  
  export const getNavigationResponse = (page) => {
    return `Navigating to ${page.description}. You can access it at ${page.path}`;
  };
  
  export const getFeatureInfo = (feature, userRole) => {
    const info = FEATURE_INFO[feature];
    if (!info) return "I don't have information about that feature.";
    
    let response = `**${info.title}**\n\n${info.description}\n\n`;
    
    if (info.steps) {
      response += 'Steps:\n';
      info.steps.forEach((step, index) => {
        response += `${index + 1}. ${step}\n`;
      });
    }
    
    // Add role-specific advice
    if (feature === 'exams' && userRole === 'teacher') {
      response += '\nAs a teacher, you can create exams in your dashboard.';
    } else if (feature === 'exams' && userRole === 'student') {
      response += '\nAs a student, exams will appear in your dashboard when available.';
    }
    
    return response;
  };
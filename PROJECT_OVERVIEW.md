# Monon Academy - Full Project Overview Diagram

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         MONON ACADEMY PLATFORM                          │
│                    Next.js 15 E-Learning Application                    │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    PUBLIC PAGES                                 │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │  • Home (/)                    • Courses (/courses)             │   │
│  │  • Login (/login)              • Sign Up (/signUp)             │   │
│  │  • Teachers (/teachers)         • Contact (/contact)            │   │
│  │  • Community (/community)      • Video Player (/video)         │   │
│  │  • Payment Success (/Payment/success)                          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                  DASHBOARD PAGES                                 │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │                                                                 │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │   │
│  │  │   ADMIN      │  │   TEACHER    │  │   STUDENT    │         │   │
│  │  │   Portal     │  │   Portal     │  │   Portal     │         │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘         │   │
│  │                                                                 │   │
│  │  • Analytics      • Create Course    • My Courses             │   │
│  │  • User Mgmt      • My Courses       • Enroll                 │   │
│  │  • Courses        • Create Exam      • Profile                │   │
│  │  • Reports        • Exams            • Exam Results           │   │
│  │  • Settings       • Profile          • Learning Progress      │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                  SHARED COMPONENTS                              │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │  • Navbar          • Footer         • ChatModal                 │   │
│  │  • HomeSlider      • FAQ            • SocialLogin              │   │
│  │  • FeaturedCourses • Testimonials   • DisableInspect           │   │
│  │  • WhyChooseUs     • Category       • PaymentModal             │   │
│  │  • VideoComponent  • OfferBanner    • FeatureProduct           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                  CONTEXT PROVIDERS                              │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │  • AuthProvider (Firebase Auth)                                 │   │
│  │  • QueryProvider (React Query)                                  │   │
│  │  • ChatProvider (Real-time Chat)                                │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                  CUSTOM HOOKS                                   │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │  • useAuth          • useRole         • useAxiosSecure         │   │
│  │  • PrivateRoute (Route Protection)                              │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                           API LAYER (Next.js API Routes)                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐     │
│  │   AUTHENTICATION │  │   COURSES        │  │   EXAMS          │     │
│  ├──────────────────┤  ├──────────────────┤  ├──────────────────┤     │
│  │  • /api/users    │  │  • /api/courses  │  │  • /api/exams    │     │
│  │  • /api/users/   │  │  • /api/courses/ │  │  • /api/exams/   │     │
│  │    role          │  │    [id]          │  │    [id]          │     │
│  │  • /api/check-   │  │  • /api/enroll   │  │  • /api/exams/   │     │
│  │    role-update   │  │  • /api/check-   │  │    [id]/submit  │     │
│  │                  │  │    enrollment    │  │  • /api/lesson-  │     │
│  │                  │  │  • /api/user-    │  │    exams         │     │
│  │                  │  │    courses       │  │                  │     │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘     │
│                                                                         │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐     │
│  │   PAYMENT        │  │   COMMUNITY      │  │   VIDEOS         │     │
│  ├──────────────────┤  ├──────────────────┤  ├──────────────────┤     │
│  │  • /api/checkout │  │  • /api/community│  │  • /api/videos   │     │
│  │  • /api/verify-  │  │                  │  │                  │     │
│  │    payment       │  │                  │  │                  │     │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘     │
│                                                                         │
│  🔒 Middleware: Firebase Auth Verification (firebase-auth.js)          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    MONGODB COLLECTIONS                          │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │                                                                 │   │
│  │  📊 users          → User accounts, roles, profiles            │   │
│  │  📚 courses        → Course data, lessons, pricing              │   │
│  │  📝 exams          → Exam questions, answers, results           │   │
│  │  🎥 videos         → Video lessons, metadata                    │   │
│  │  💬 posts          → Community posts, discussions               │   │
│  │  💳 payments       → Payment transactions, enrollments         │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  🔌 Connection: dbConnect.js (MongoDB Client)                          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  🔐 Firebase Authentication                                             │
│     ├─ Email/Password Auth                                             │
│     ├─ Google Sign-In                                                   │
│     └─ Token Verification (Firebase Admin SDK)                         │
│                                                                         │
│  💳 Stripe Payment Gateway                                              │
│     ├─ Checkout Sessions                                                │
│     └─ Payment Verification                                             │
│                                                                         │
│  ☁️ Cloudinary (File Storage)                                           │
│     ├─ Course Images                                                    │
│     ├─ Exam Images                                                      │
│     └─ Question Images                                                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
monon-academy/
│
├── 📂 src/
│   ├── 📂 app/                          # Next.js App Router
│   │   ├── 📂 api/                      # API Routes
│   │   │   ├── check-enrollment/
│   │   │   ├── check-role-update/
│   │   │   ├── checkout/                # Stripe checkout
│   │   │   ├── community/               # Community posts
│   │   │   ├── courses/                 # Course CRUD
│   │   │   │   └── [id]/               # Single course
│   │   │   ├── enroll/                  # Course enrollment
│   │   │   ├── exams/                   # Exam management
│   │   │   │   ├── [id]/               # Single exam
│   │   │   │   └── [id]/submit/        # Exam submission
│   │   │   ├── lesson-exams/
│   │   │   ├── user-courses/            # User's enrolled courses
│   │   │   ├── users/                   # User management
│   │   │   │   └── role/               # Role management
│   │   │   ├── verify-payment/          # Payment verification
│   │   │   └── videos/                  # Video management
│   │   │
│   │   ├── 📂 assets/                   # Static assets
│   │   │   ├── faq.json
│   │   │   └── images/
│   │   │
│   │   ├── 📂 community/                # Community page
│   │   ├── 📂 contact/                  # Contact page
│   │   ├── 📂 courses/                  # Course pages
│   │   │   ├── [id]/                   # Course detail
│   │   │   │   ├── exam/               # Course exam
│   │   │   │   └── learn/              # Learning page
│   │   │   └── page.jsx                 # Course listing
│   │   │
│   │   ├── 📂 dashboard/                # Dashboard
│   │   │   ├── dashBoardSlider/         # Sidebar component
│   │   │   ├── layout.js                # Dashboard layout
│   │   │   ├── page.js                  # Dashboard home
│   │   │   ├── 📂 teacher/              # Teacher dashboard
│   │   │   │   ├── create-exam/
│   │   │   │   ├── createCourse/
│   │   │   │   ├── edit-exam/[id]/
│   │   │   │   ├── exams/               # Exam management
│   │   │   │   │   ├── [id]/           # Exam detail
│   │   │   │   │   └── ExamResult/      # Results component
│   │   │   │   ├── myCourses/           # Teacher's courses
│   │   │   │   └── profile/
│   │   │   └── 📂 user/                 # User dashboard
│   │   │       ├── enroll/             # Enrollment page
│   │   │       └── profile/
│   │   │
│   │   ├── 📂 login/                   # Login page
│   │   ├── 📂 signUp/                  # Sign up page
│   │   ├── 📂 Payment/                 # Payment pages
│   │   │   ├── PaymentModal.jsx
│   │   │   └── success/                # Success page
│   │   ├── 📂 teachers/                # Teachers listing
│   │   ├── 📂 unauthorized/            # Unauthorized page
│   │   ├── 📂 video/                   # Video player
│   │   │   └── videos/                # Video cards
│   │   │
│   │   ├── 📂 Pages/                   # Home page components
│   │   │   ├── Category/
│   │   │   ├── FaqSection/
│   │   │   ├── FeaturedCourses.jsx
│   │   │   ├── HomeSlider/
│   │   │   ├── OfferBanner/
│   │   │   ├── TestimonialSection/
│   │   │   ├── VideoComponent/
│   │   │   └── WhyChooseUs/
│   │   │
│   │   ├── 📂 shareComponent/          # Shared components
│   │   │   ├── ChatModal/             # Chat functionality
│   │   │   ├── DisableInspect/        # Security
│   │   │   ├── ExamPage/
│   │   │   ├── featureProduct/
│   │   │   ├── footer/
│   │   │   ├── navbar/
│   │   │   └── SocialLogin/
│   │   │
│   │   ├── layout.js                   # Root layout
│   │   ├── page.js                     # Home page
│   │   └── globals.css                 # Global styles
│   │
│   ├── 📂 context/                     # React Context
│   │   ├── AuthContext.jsx             # Auth state
│   │   ├── AuthProvider.jsx            # Auth provider
│   │   ├── ChatContext.jsx             # Chat state
│   │   └── QueryProvider.jsx           # React Query provider
│   │
│   ├── 📂 hooks/                       # Custom hooks
│   │   ├── PrivateRoute.jsx            # Route protection
│   │   ├── useAuth.jsx                 # Auth hook
│   │   ├── useAxiosSecure.jsx          # Secure API calls
│   │   └── useRole.jsx                 # Role hook
│   │
│   └── 📂 lib/                         # Utilities
│       ├── dbConnect.js                # MongoDB connection
│       ├── firebase-admin.js           # Firebase Admin SDK
│       ├── firebase.config.js          # Firebase config
│       └── utils.js                    # Helper functions
│
├── 📂 middleware/                      # Next.js middleware
│   └── firebase-auth.js                # Auth middleware
│
├── 📂 public/                          # Static files
│   ├── uploads/                        # User uploads
│   │   ├── exams/
│   │   └── questions/
│   └── [svg files]
│
├── 📄 package.json                     # Dependencies
├── 📄 next.config.mjs                  # Next.js config
├── 📄 tailwind.config.js               # Tailwind config
└── 📄 README.md
```

## 🔑 Key Features

### 1. **Authentication & Authorization**
- Firebase Authentication (Email/Password, Google)
- Role-based access control (Admin, Teacher, Student, User)
- Protected routes with `PrivateRoute` component
- JWT token verification via Firebase Admin SDK

### 2. **Course Management**
- Create, read, update, delete courses
- Course enrollment system
- Course categorization (subject, class, group)
- Course search and filtering
- Instructor course management

### 3. **Exam System**
- Create exams with multiple question types
- Image uploads for questions
- Exam submission and grading
- Exam results tracking
- Lesson-specific exams

### 4. **Video Learning**
- Video player integration (React Player)
- YouTube video support
- Video lesson management
- Progress tracking

### 5. **Payment Integration**
- Stripe payment gateway
- Course purchase flow
- Payment verification
- Enrollment after payment

### 6. **Community Features**
- Community posts and discussions
- Real-time chat functionality
- Chat modal component

### 7. **User Management**
- User profiles
- Role management
- User dashboard (role-specific)
- Profile customization

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4 + DaisyUI
- **State Management**: React Context API
- **Data Fetching**: React Query (TanStack Query)
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Icons**: React Icons, Lucide React
- **Animations**: Framer Motion, Lottie React

### Backend
- **Runtime**: Node.js (Next.js API Routes)
- **Database**: MongoDB
- **Authentication**: Firebase Auth
- **File Storage**: Cloudinary
- **Payment**: Stripe

### Development Tools
- **Linting**: ESLint
- **Build Tool**: Turbopack
- **Package Manager**: npm

## 🔐 Security Features

1. **Firebase Auth Middleware**: Token verification on API routes
2. **Role-based Access Control**: Different dashboards per role
3. **Private Routes**: Protected pages with authentication check
4. **Disable Inspect**: Security component to prevent inspection
5. **Secure API Calls**: `useAxiosSecure` hook for authenticated requests

## 📊 Data Flow

```
User Action
    ↓
Client Component
    ↓
API Route (/api/*)
    ↓
Firebase Auth Middleware (if protected)
    ↓
MongoDB Database
    ↓
Response to Client
    ↓
React Query Cache
    ↓
UI Update
```

## 🎯 User Roles & Permissions

| Role     | Permissions                                                      |
|----------|------------------------------------------------------------------|
| **Admin** | Full system access, user management, analytics, reports         |
| **Teacher** | Create courses, create exams, manage own courses, view results |
| **Student** | Enroll in courses, take exams, view progress, access videos     |
| **User**   | Browse courses, view public content, enroll (after payment)      |

## 🚀 API Endpoints Summary

| Endpoint                    | Method | Description                    |
|----------------------------|--------|--------------------------------|
| `/api/users`               | GET/POST | User management                |
| `/api/users/role`          | GET     | Get user role                  |
| `/api/courses`             | GET/POST | Course listing/creation        |
| `/api/courses/[id]`        | GET     | Single course details          |
| `/api/enroll`              | POST    | Enroll in course               |
| `/api/exams`               | GET/POST | Exam management                |
| `/api/exams/[id]`          | GET     | Get exam details               |
| `/api/exams/[id]/submit`   | POST    | Submit exam                    |
| `/api/checkout`            | POST    | Create Stripe checkout         |
| `/api/verify-payment`      | POST    | Verify payment                 |
| `/api/community`           | GET/POST | Community posts                |
| `/api/videos`              | GET/POST | Video management               |
| `/api/user-courses`        | GET     | Get user's enrolled courses    |
| `/api/check-enrollment`    | GET     | Check enrollment status        |

## 📦 Key Dependencies

### Core
- `next`: 15.5.4
- `react`: 19.1.0
- `react-dom`: 19.1.0

### Database & Auth
- `mongodb`: 6.21.0
- `firebase`: 12.4.0
- `firebase-admin`: 13.6.0

### UI & Styling
- `tailwindcss`: 4.x
- `daisyui`: 5.5.5
- `lucide-react`: 0.545.0

### State & Data
- `@tanstack/react-query`: 5.90.2
- `axios`: 1.12.2
- `swr`: 2.3.6

### Payment
- `stripe`: 20.0.0
- `@stripe/stripe-js`: 8.5.2

### Forms & Validation
- `react-hook-form`: 7.65.0

### Media
- `react-player`: 3.3.3
- `cloudinary`: 2.7.0

## 🔄 State Management Flow

```
┌─────────────┐
│   User      │
│   Action    │
└──────┬──────┘
       │
       ▼
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Context   │─────▶│   React     │─────▶│   MongoDB   │
│  Providers  │      │   Query     │      │   Database  │
└─────────────┘      └─────────────┘      └─────────────┘
       │                     │                     │
       │                     │                     │
       ▼                     ▼                     ▼
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   UI        │◀─────│   Cache     │◀─────│   Response  │
│   Update    │      │   Update    │      │   Data      │
└─────────────┘      └─────────────┘      └─────────────┘
```

## 🎨 UI/UX Features

- Responsive design (mobile-first)
- Dark/Light theme support
- Loading states and skeletons
- Toast notifications
- Modal dialogs
- Sidebar navigation (dashboard)
- Search functionality
- Image optimization (Next.js Image)
- Smooth animations and transitions

## 📝 Environment Variables Required

```env
MONGODB_URI=          # MongoDB connection string
DB_NAME=              # Database name
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
FIREBASE_ADMIN_PRIVATE_KEY=
FIREBASE_ADMIN_CLIENT_EMAIL=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

**Generated**: Complete project architecture overview for Monon Academy
**Version**: 1.0
**Last Updated**: 2025


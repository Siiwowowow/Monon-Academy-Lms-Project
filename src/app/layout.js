"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./shareComponent/navbar/Navbar";
import Footer from "./shareComponent/footer/Footer";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/context/AuthProvider";
import QueryProvider from "@/context/QueryProvider";
import { usePathname } from "next/navigation";

import { ChatProvider } from "@/context/ChatContext";
import ChatButton from "./shareComponent/ChatModal/ChatButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <html lang="en" suppressHydrationWarning data-theme="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <AuthProvider>
            <ChatProvider>
              {!isDashboard && <Navbar />}
              {children}
              <ChatButton />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "#363636",
                    color: "#fff",
                  },
                  success: {
                    duration: 3000,
                    theme: {
                      primary: "green",
                      secondary: "black",
                    },
                  },
                  error: {
                    duration: 5000,
                  },
                  loading: {
                    duration: Infinity,
                  },
                }}
              />
              {!isDashboard && <Footer />}
            </ChatProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

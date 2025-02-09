import { Geist, Geist_Mono } from "next/font/google";
import AuthRedirect from "./AuthRedirect"; // Import the AuthRedirect component
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
export const metadata = {
  title: "WaveTalk", // Default title
  description: "This is my website description",
  icons: {
    icon: "/chat.svg", // Path to favicon (inside `public/` folder)
  },
};

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Include the AuthRedirect component to handle redirection */}
        <AuthRedirect />
        {children}
      </body>
    </html>
  );
}

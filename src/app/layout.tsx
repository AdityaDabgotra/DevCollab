import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import Providers from "./providers";
import Navbar from "../components/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dev Collab",
  description: "DevCollab is a full-stack web application designed to help developers connect, collaborate, and build projects together in an organized and interactive environment.The platform allows project owners to create and manage projects, review applicants, control project status (open/closed), and communicate with collaborators through an integrated real-time chat system. Developers can explore projects, apply based on their tech stack, and build meaningful collaborations.Built using modern web technologies, DevCollab emphasizes clean UI, scalable backend architecture, and secure role-based functionality.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Navbar />
          {children}
          <ToastContainer 
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Providers>
      </body>
    </html>
  );
}
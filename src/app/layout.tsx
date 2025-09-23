import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import SidebarComponent from "@/components/Sidebar/Sidebar";
import AppHeader from "@/components/layout/AppHeader";
import { SettingsProvider } from "@/context/SettingsContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Crowd Chat",
  description:
    "Tu inteligencia artificial de bolsillo. Rapida configuracion y Rapidas Respuestas",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={` ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SettingsProvider>
          <SidebarProvider>
            <SidebarComponent />

            <div className="bg-gray-800 flex flex-col w-full min-h-screen">
              <AppHeader />
              <main className="flex-1 p-4">{children}</main>
            </div>
          </SidebarProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}

import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatChatButtons from "@/components/FloatChatButtons";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col text-zinc-900">
        <Header />
        <main className="flex-1">{children}

           <FloatChatButtons />
        </main>
        <Footer />
      </body>
    </html>
  );
}